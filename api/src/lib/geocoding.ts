import type { GeocodingResult } from "@weather-app/shared";

const BASE_URL = "https://geocoding-api.open-meteo.com/v1";

interface OpenMeteoGeoResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    country_code: string;
    admin1?: string;
  }>;
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  if (!query || query.length < 2) return [];

  const params = new URLSearchParams({
    name: query,
    count: "8",
    language: "en",
    format: "json",
  });

  const res = await fetch(`${BASE_URL}/search?${params}`);
  if (!res.ok) {
    throw new Error(`Geocoding API error: ${res.status}`);
  }

  const data: OpenMeteoGeoResponse = await res.json();

  return (data.results ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country,
    country_code: r.country_code,
    admin1: r.admin1,
  }));
}
