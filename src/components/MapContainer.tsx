import { getStations } from "@/lib/api/stations";
import { Map } from "./Map";

export async function MapContainer() {
  const stations = await getStations();

  return <Map stations={stations} />;
}
