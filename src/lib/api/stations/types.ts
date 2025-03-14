export type NSError = {
  message: string;
};

export type StationsReponse = {
  payload: StationDto[];
};

export interface StationDto {
  id: Id;
  stationType: string;
  names: Names;
  location: Location;
  tracks: string[];
  hasKnownFacilities: boolean;
  availableForAccessibleTravel: boolean;
  hasTravelAssistance: boolean;
  areTracksIndependentlyAccessible: boolean;
  isBorderStop: boolean;
  country: string;
  radius?: number;
  approachingRadius?: number;
  distance?: number;
  startDate?: string;
  endDate?: string;
  nearbyMeLocationId?: NearbyMeLocationId;
}

interface Id {
  uicCode: string;
  uicCdCode: string;
  evaCode: string;
  cdCode: number;
  code: string;
}

interface Names {
  long: string;
  medium: string;
  short: string;
  festive: string;
  synonyms: string[];
}

export interface Location {
  lat: number;
  lng: number;
}

interface NearbyMeLocationId {
  value: string;
  type: string;
}
