import { useCallback, useEffect, useMemo, useRef } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON, { GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { Station } from "../../lib/api/stations";
import { stationStyle, createProvinceStyle, getUniqueColor } from "./styles.ts";
import "ol/ol.css";
import {
  createFeatureCollection,
  getFeatureById,
  getIntersectingPoints,
} from "./utils.ts";
import { CRS } from "./constants.ts";
import { Feature } from "ol";
import toast from "react-hot-toast";
import { ToastMessage } from "../ToastMessage.tsx";

interface MapComponentProps {
  stations: Station[];
}

// No need to define these in the component
const geoJsonFormat = new GeoJSON();

export function Map({ stations }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);
  const activeColor = useRef<string | null>(null);

  const onProvinceClick = useCallback(
    (name: string, stationsWithin: Pick<Station, "id" | "name">[]) => {
      toast.custom(<ToastMessage name={name} stations={stationsWithin} />, {
        duration: 4000,
        position: "bottom-left",
      });
    },
    [],
  );
  const onWinCondition = useCallback(() => {
    toast.success("Alle provincies zijn dezelfde kleur! 🎉", {
      icon: "🎉",
      duration: 0,
      position: "top-center",
    });
  }, []);

  const stationFeatures = useMemo<GeoJSONFeatureCollection>(
    () =>
      createFeatureCollection(
        stations.map((station) => Station.toFeatureLike(station)),
      ),
    [stations],
  );

  const stationsLayer = useMemo(() => {
    // Create vector source and layer for provinces
    const stationsSource = new VectorSource({
      features: geoJsonFormat.readFeatures(stationFeatures, {
        dataProjection: CRS.WGS84,
        featureProjection: CRS.WEB_MERCATOR,
      }),
    });

    return new VectorLayer({
      source: stationsSource,
      opacity: 0.8,
      style: stationStyle,
    });
  }, [stationFeatures]);

  const areFeaturesTheSameColor = useCallback((features: Feature[]) => {
    if (activeColor.current === null) return false;

    return features.every((feature) => {
      return feature.get("color") === activeColor.current;
    });
  }, []);

  const provincesLayer = useMemo(() => {
    // Create vector source and layer for provinces
    const provincesSource = new VectorSource({
      url: "/provinces.json",
      format: geoJsonFormat,
    });

    provincesSource.on("featuresloadend", () => {
      provincesSource.getFeatures().forEach((feature) => {
        const randomColor = getUniqueColor();
        feature.set("color", randomColor);
        feature.setStyle(createProvinceStyle(randomColor));
      });
    });

    provincesSource.on("changefeature", () => {
      const features = provincesSource.getFeatures();
      if (areFeaturesTheSameColor(features)) {
        onWinCondition();
      }
    });

    return new VectorLayer({
      properties: {
        name: "Provinces",
      },
      source: provincesSource,
      opacity: 1,
    });
  }, [areFeaturesTheSameColor, onWinCondition]);

  useEffect(() => {
    if (!mapRef.current) return;

    const map = new OlMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          opacity: 0.4,
          source: new OSM(),
        }),
        provincesLayer,
        stationsLayer,
      ],
      view: new View({
        center: fromLonLat([5.2913, 52.1326]), // Center of Netherlands
        zoom: 7,
      }),
    });

    mapInstanceRef.current = map;
    map.on("click", (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
        {
          layerFilter: (candidate) =>
            candidate.getProperties().name === "Provinces",
        },
      );
      const realFeature = getFeatureById(provincesLayer, feature?.getId());
      if (realFeature) {
        const stationsWithin = getIntersectingPoints(
          stationsLayer.getSource(),
          realFeature.getGeometry(),
        )
          .map((feature) => Station.maybeCreate(feature.getProperties()))
          .filter((station): station is Station => station !== null);

        if (activeColor.current === null) {
          activeColor.current = realFeature.get("color");
        } else {
          realFeature.set("color", activeColor.current, true);
          realFeature.setStyle(createProvinceStyle(activeColor.current));
        }

        onProvinceClick(realFeature.getProperties().name, stationsWithin);
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [onProvinceClick, provincesLayer, stationFeatures, stationsLayer]);

  return <div ref={mapRef} className="h-full w-full" />;
}
