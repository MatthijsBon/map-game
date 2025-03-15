"use server";
import { getStationsPromise, Station } from "../lib/api/stations";
import { Map } from "./Map";

type MapWrapperProps = {
  onProvinceClick: (
    name: string,
    stationsWithin: Pick<Station, "id" | "name">[],
  ) => void;
};

export async function MapContainer({ onProvinceClick }: MapWrapperProps) {
  const stations = await getStationsPromise;

  return <Map onProvinceClick={onProvinceClick} stations={stations} />;
}
