import type { InPostPoint, SearchPreferences } from "../types/point";
import { getPointTypeLabel, isOpen24h, isOperating } from "./pointHelpers";

export function calculateScore(point: InPostPoint, distanceKm: number, preferences: SearchPreferences): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  const distanceScore = Math.max(0, 400 - distanceKm * 25);
  score += distanceScore;

  if (isOperating(point)) {
    score += 50;
    reasons.push("Operating point");
  }

  if (isOpen24h(point)) {
    score += 20;
    reasons.push("Available 24/7");
  }

  const pointType = getPointTypeLabel(point);

  if (preferences.preferredType !== "any" && pointType === preferences.preferredType) {
    score += 15;
    reasons.push(`Matches preferred type: ${preferences.preferredType}`);
  }

  if (distanceKm <= 1) {
    reasons.push("Very close to the searched location");
  } else if (distanceKm <= 3) {
    reasons.push("Close to the searched location");
  }

  return {
    score: Math.round(score * 10) / 10,
    reasons,
  };
}