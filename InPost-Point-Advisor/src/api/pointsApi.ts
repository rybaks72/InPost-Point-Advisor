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
  const allPoints: InPostPoint[] = [];

  for (let page = 1; page <= options.maxPages; page++) {
    const pointsFromPage = await fetchPointsPage(
      page,
      options.perPage,
      options.country
    );

    allPoints.push(...pointsFromPage);

    if (pointsFromPage.length === 0) {
      break;
    }
  }

  return allPoints;
}