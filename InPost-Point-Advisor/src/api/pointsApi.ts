import type { FetchPointsOptions, InPostPoint, PointsApiResponse } from "../types/point";

const BASE_URL = "https://api-global-points.easypack24.net/v1/points";

function buildPointsUrl(page: number, perPage: number, country?: string): string {
  const url = new URL(BASE_URL);

  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  if (country && country.trim() !== "") {
    url.searchParams.set("country", country.trim().toUpperCase());
  }

  return url.toString();
}

export async function fetchPointsPage(page: number,perPage: number,country?: string): Promise<InPostPoint[]> {
  const url = buildPointsUrl(page, perPage, country);

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch InPost points page ${page}.`);
  }

  const data: PointsApiResponse = await response.json();

  return data.items;
}

export async function fetchPoints(options: FetchPointsOptions): Promise<InPostPoint[]> {
  const firstPage = await fetch(buildPointsUrl(1, options.perPage, options.country));
  if (!firstPage.ok) throw new Error("Failed to fetch InPost points.");
  
  const firstData: PointsApiResponse = await firstPage.json();
  const allPoints: InPostPoint[] = [...firstData.items];
  
  const totalPages = firstData.total_pages;
  
  if (totalPages <= 1) return allPoints;

  const remainingPages = Array.from({ length: totalPages - 1 }, (_, i) => i + 2);
  
  const results = await Promise.all(
    remainingPages.map(async (page) => {
      const response = await fetch(buildPointsUrl(page, options.perPage, options.country));
      if (!response.ok) throw new Error(`Failed to fetch page ${page}.`);
      const data: PointsApiResponse = await response.json();
      return data.items;
    })
  );

  return allPoints.concat(results.flat());
}