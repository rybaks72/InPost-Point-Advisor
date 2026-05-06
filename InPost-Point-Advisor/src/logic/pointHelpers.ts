import type { InPostPoint } from "../types/point";

export function hasValidLocation(point: InPostPoint): boolean {
  return (
    typeof point.location?.latitude === "number" &&
    typeof point.location?.longitude === "number"
  );
}

export function isOperating(point: InPostPoint): boolean {
  return point.status === "Operating";
}

export function isOpen24h(point: InPostPoint): boolean {
  const openingHours = point.opening_hours?.toLowerCase() ?? "";

  return (
    openingHours.includes("24/7") ||
    openingHours.includes("24h") ||
    openingHours.includes("24")
  );
}

export function getPointTypeLabel(point: InPostPoint): "locker" | "point" | "other" {
  const types = Array.isArray(point.type) ? point.type : [point.type];

  if (types.some((type) => type.toLowerCase().includes("locker"))) {
    return "locker";
  }

  if (types.some((type) => type.toLowerCase().includes("pop"))) {
    return "point";
  }

  return "other";
}