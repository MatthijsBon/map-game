import { StationDto, Location } from "./types";
import { GeoJSONFeature } from "ol/format/GeoJSON";

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
  toFeatureLike(station: Station): GeoJSONFeature {
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
        location: station.location,
      },
    };
  },
  hasStationProperties(
    properties: Record<string, unknown>,
  ): properties is Station {
    return (
      "id" in properties &&
      "name" in properties &&
      "location" in properties &&
      "country" in properties
    );
  },
  maybeCreate(properties: Record<string, unknown>): Station | null {
    if (this.hasStationProperties(properties)) {
      return properties;
    }
    return null;
  },
};
