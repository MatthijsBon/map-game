import { Station } from "../lib/api/stations";

type ToastMessageProps = {
  name: string;
  stations: Pick<Station, "id" | "name">[];
};

export function ToastMessage({ name, stations }: ToastMessageProps) {
  return (
    <div className="bg-grey-100 rounded-lg px-4 py-6 text-blue-100">
      <h2 className="text-lg font-bold">🌍 Provincie: {name}</h2>
      <ul className="text-s list-none px-1 py-2 font-light">
        {stations.map((station) => (
          <li key={station.id}>🚉 {station.name}</li>
        ))}
      </ul>
    </div>
  );
}
