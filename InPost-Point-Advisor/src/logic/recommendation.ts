import type { InPostPoint, RecommendedPoint, SearchPreferences } from "../types/point";
import { getDistanceKm } from "./distance";
import { calculateScore } from "./scoring";
import { hasValidLocation, isOpen24h, isOperating } from "./pointHelpers";

type UserLocation = {
  latitude: number;
  longitude: number;
};

export function recommendPoints(points: InPostPoint[], userLocation: UserLocation, preferences: SearchPreferences): RecommendedPoint[] {
  return points
    .filter(hasValidLocation)
    .filter((point) => {
      if (preferences.onlyOperating && !isOperating(point)) {
        return false;
      }

      if (preferences.prefer24h && !isOpen24h(point)) {
        return false;
      }

      return true;
    })
    .map((point) => {
      const distanceKm = getDistanceKm(
        userLocation.latitude,
        userLocation.longitude,
        point.location.latitude,
        point.location.longitude
      );

      const { score, reasons } = calculateScore(point, distanceKm, preferences);

      return {
        point,
        distanceKm,
        score,
        reasons,
      };
    })
    .filter((recommendedPoint) => {
      return recommendedPoint.distanceKm <= preferences.maxDistanceKm;
    })
    .sort((a, b) => {
    if (b.score !== a.score) {
        return b.score - a.score;
    }
    return a.distanceKm - b.distanceKm;
    })
    .slice(0, preferences.maxResults);
}