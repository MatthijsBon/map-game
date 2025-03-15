"use server";
import { getStationsPromise, Station } from "../lib/api/stations";
import { Map } from "./Map";

type MapWrapperProps = {
  onProvinceClick: (
    name: string,
    stationsWithin: Pick<Station, "id" | "name">[],
  ) => void;
  onWinCondition: () => void;
};

export async function MapContainer({
  onProvinceClick,
  onWinCondition,
}: MapWrapperProps) {
  const stations = await getStationsPromise;

  return (
    <Map
      onProvinceClick={onProvinceClick}
      onWinCondition={onWinCondition}
      stations={stations}
    />
  );
}
