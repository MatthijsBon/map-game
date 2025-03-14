"use client";
import { useEffect, useMemo, useRef } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON, { GeoJSONFeatureCollection } from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { WMTS } from "ol/source";
import { Options, optionsFromCapabilities } from "ol/source/WMTS";
import { WMTSCapabilities } from "ol/format";
import { FeatureLike } from "ol/Feature";
import { Station } from "../lib/api/stations";
import { stationStyle, provinceStyle } from "./styles.ts";
import "ol/ol.css";

interface MapComponentProps {
  onProvinceClick: (feature: FeatureLike) => void;
  capabilities: string;
  stations: Station[];
  color: string;
}

const wmtsCapabilitiesParser = new WMTSCapabilities();
const geoJsonFormat = new GeoJSON();
export function Map({
  onProvinceClick,
  capabilities,
  stations,
}: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);

  const stationFeatures = useMemo<GeoJSONFeatureCollection>(
    () => ({
      type: "FeatureCollection",
      crs: {
        type: "name",
        properties: {
          name: "EPSG:4326",
        },
      },
      features: stations.map((station) => Station.toFeatureLike(station)),
    }),
    [stations],
  );

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source and layer for provinces
    const provincesSource = new VectorSource({
      url: "/provinces.json",
      format: geoJsonFormat,
    });

    const provincesLayer = new VectorLayer({
      source: provincesSource,
      opacity: 0.7,
      style: provinceStyle,
    });

    // Create vector source and layer for stations
    const stationsSource = new VectorSource({
      features: geoJsonFormat.readFeatures(stationFeatures, {
        dataProjection: "EPSG:4326",
        featureProjection: "EPSG:3857",
      }),
    });

    const stationsLayer = new VectorLayer({
      source: stationsSource,
      opacity: 1,
      style: stationStyle,
    });

    const parsedCapabilities = wmtsCapabilitiesParser.read(capabilities);
    const options = optionsFromCapabilities(parsedCapabilities, {
      layer: "grijs",
      matrixSet: "EPSG:3857",
    }) as Options;

    const map = new OlMap({
      target: mapRef.current,
      layers: [
        new TileLayer({
          opacity: 0.4,
          source: new OSM(),
        }),
        new TileLayer({
          opacity: 1,
          source: new WMTS(options),
        }),
        provincesLayer,
        stationsLayer,
      ],
      view: new View({
        center: fromLonLat([5.2913, 52.1326]), // Center of Netherlands
        zoom: 7,
      }),
    });

    map.on("click", (event) => {
      const feature = map.forEachFeatureAtPixel(
        event.pixel,
        (feature) => feature,
      );
      if (feature) {
        onProvinceClick(feature);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setTarget(undefined);
      }
    };
  }, [capabilities, onProvinceClick, stationFeatures]);

  return <div ref={mapRef} className="h-full w-full" />;
}
