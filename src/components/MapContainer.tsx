"use server";
import { getStationsPromise } from "../lib/api/stations";
import { FeatureLike } from "ol/Feature";
import { Map } from "./Map";

const brtCapabilitiesPromise = fetch(
  "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0?request=getcapabilities&service=wmts",
).then((response) => {
  if (response.ok) {
    return response.text();
  }
  throw new Error("Failed to fetch BRT capabilities");
});

type MapWrapperProps = {
  onProvinceClick: (feature: FeatureLike) => void;
};

export async function MapContainer({ onProvinceClick }: MapWrapperProps) {
  const capabilities = await brtCapabilitiesPromise;
  const stations = await getStationsPromise;

  return (
    <Map
      onProvinceClick={onProvinceClick}
      capabilities={capabilities}
      stations={stations}
    />
  );
}
