export type PointLocation = {
  latitude: number;
  longitude: number;
};

export type InPostPoint = {
  name: string;
  type: string[] | string;
  status: string;
  location: PointLocation;
  functions?: string[];
  opening_hours?: string;
  address_details?: {
    city?: string;
    street?: string;
    building_number?: string;
    post_code?: string;
    province?: string;
  };
  location_description?: string;
};

export type PointsApiResponse = {
  count: number;
  page: number;
  total_pages: number;
  items: InPostPoint[];
};

export type FetchPointsOptions = {
  country?: string;
  maxPages: number;
  perPage: number;
};

export type SearchPreferences = {
  address: string;
  country: string;
  countryName: string;
  maxPages: number;
  maxResults: number;
  maxDistanceKm: number;
  onlyOperating: boolean;
  prefer24h: boolean;
  preferredType: "any" | "locker" | "point";
};

export type RecommendedPoint = {
  point: InPostPoint;
  distanceKm: number;
  score: number;
  reasons: string[];
};