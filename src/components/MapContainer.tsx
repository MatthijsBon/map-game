import { getStationsPromise } from "../lib/api/stations";
import { Map } from "./Map";
import { use } from "react";

export function MapContainer() {
  const stations = use(getStationsPromise);

  return <Map stations={stations} />;
}
