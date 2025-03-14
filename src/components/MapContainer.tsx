"use server";
import { getStationsPromise } from "../lib/api/stations";
import { FeatureLike } from "ol/Feature";
import { Map } from "./Map";

type MapWrapperProps = {
  onProvinceClick: (feature: FeatureLike) => void;
};

export async function MapContainer({ onProvinceClick }: MapWrapperProps) {
  const stations = await getStationsPromise;

  return <Map onProvinceClick={onProvinceClick} stations={stations} />;
}
