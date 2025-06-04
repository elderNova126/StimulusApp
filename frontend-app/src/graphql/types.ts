export interface User {
  id: string;
  externalAuthSystemId?: string | null;
  givenName?: string;
  surname?: string;
  email?: string | null;
  jobTitle?: string | null;
  mobilePhone?: string | null;
  displayName?: string | null;
  businessPhones?: string[];
  accountEnabled?: boolean | null;
}

export interface Note {
  id: number;
  body: string;
  createdBy: string;
  created: string;
}

export enum GeneralTypeList {
  ALL = 0,
  FAVORITE = 1,
  INTERNAL = 2,
}

export interface InternalProject {
  id: string;
  status: string;
  title: string;
  archived: boolean;
  startDate: string;
  endDate: string;
  expectedStartDate: string;
  expectedEndDate: string;
  budget: string;
  targetScore: number;
  projectCompany: any;
  deleted: boolean;
  scoreProject: number;
  collaborations: Collaborations[];
  remainingDays?: number | null;
}

export interface Collaborations {
  id: string;
  userId: string;
  status: string;
}

export interface ProjectEvaluation {
  scoreValue: number;
  budgetSpend: number;
}

export interface Position {
  coords: Coordinates;
  timestamp: number;
}

export interface PositionError {
  code: number;
  message: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number;
  altitudeAccuracy: number | null;
  heading: number | null;
  speed: number | null;
}

export interface NominatimResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city: string;
    state_district: string;
    state: string;
    'ISO3166-2-lvl4': string;
    postcode: string;
    country_code: string;
    country: string;
  };
  boundingbox: string[];
}
