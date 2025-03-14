import { useEffect, useRef } from "react";
import OlMap from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import OSM from "ol/source/OSM";
import GeoJSON from "ol/format/GeoJSON";
import { fromLonLat } from "ol/proj";
import { WMTS } from "ol/source";
import { Options, optionsFromCapabilities } from "ol/source/WMTS";
import { WMTSCapabilities } from "ol/format";
import { FeatureLike } from "ol/Feature";
import "ol/ol.css";

interface MapComponentProps {
  onProvinceClick: (feature: FeatureLike) => void;
  capabilities: string;
}

const brtCapabilitiesPromise = fetch(
  "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?request=getcapabilities&service=wmts",
).then((response) => {
  if (response.ok) {
    return response.text();
  }
  throw new Error("Failed to fetch BRT capabilities");
});

export async function MapWrapper({
  onProvinceClick,
}: Pick<MapComponentProps, "onProvinceClick">) {
  const capabilities = await brtCapabilitiesPromise;

  return <Map onProvinceClick={onProvinceClick} capabilities={capabilities} />;
}

const wmtsCapabilitiesParser = new WMTSCapabilities();
function Map({ onProvinceClick, capabilities }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<OlMap | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Create vector source and layer for provinces
    const provincesSource = new VectorSource({
      url: "/provinces.json",
      format: new GeoJSON(),
    });

    const provincesLayer = new VectorLayer({
      source: provincesSource,
      opacity: 0.4,
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
  }, [capabilities, onProvinceClick]);

  return <div ref={mapRef} className="h-full w-full" />;
}
