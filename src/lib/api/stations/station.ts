import { StationDto, Location } from "./types.ts";

export type Station = {
  id: string;
  name: string;
  location: Location;
  country: string;
};

export const Station = {
  fromDto(dto: StationDto): Station {
    return {
      id: dto.id.uicCode,
      name: dto.names.long,
      location: dto.location,
      country: dto.country,
    };
  },
  toFeatureLike(station: Station) {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [station.location.lng, station.location.lat],
      },
      properties: {
        id: station.id,
        name: station.name,
        country: station.country,
      },
    };
  },
};
