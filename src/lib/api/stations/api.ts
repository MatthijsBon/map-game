import { NSError, StationsReponse } from "./types.ts";
import { Station } from "./station.ts";

const isStationsReponse = (
  data: StationsReponse | NSError,
): data is StationsReponse => "payload" in data && Array.isArray(data.payload);

export const getStationsPromise = fetch(
  "https://gateway.apiportal.ns.nl/nsapp-stations/v3?countryCodes=NL",
  {
    method: "GET",
    headers: {
      "Ocp-Apim-Subscription-Key": import.meta.env.VITE_APP_NS_API_KEY,
    },
  },
)
  .then((response) => {
    return response.json();
  })
  .then((data: StationsReponse | NSError) => {
    if (isStationsReponse(data)) {
      return data.payload.map((stationDto) => Station.fromDto(stationDto));
    } else {
      const errorMessage = data.message;
      throw new Error(
        `Failed to fetch NS Stations, details: [${errorMessage}]`,
      );
    }
  })
  .catch((error) => {
    console.error(
      "An unexpected error occurred while fetching NS Stations",
      error,
    );
    return [];
  });
