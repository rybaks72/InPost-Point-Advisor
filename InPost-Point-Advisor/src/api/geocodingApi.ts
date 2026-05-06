export type Coordinates = {
  latitude: number;
  longitude: number;
};

export async function geocodeAddress(address: string, country: string): Promise<Coordinates> {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", `${address}, ${country}`);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");
  url.searchParams.set("countrycodes", country.toLowerCase());

  const response = await fetch(url.toString(), {
    headers: {
      "Accept-Language": "en",
      "User-Agent": "InPostFinderApp/1.0",
    },
  });

  if (!response.ok) throw new Error("Geocoding request failed.");

  const results = await response.json();

  if (results.length === 0) throw new Error(`Could not find location: "${address}"`);

  return {
    latitude: parseFloat(results[0].lat),
    longitude: parseFloat(results[0].lon),
  };
}