import type { WeatherData, GeocodingResult } from "@weather-app/shared";
import { apiFetch } from "./http";

export async function getWeather(params: {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  countryCode?: string;
}): Promise<WeatherData> {
  const searchParams = new URLSearchParams({
    lat: String(params.lat),
    lon: String(params.lon),
  });
  if (params.city) searchParams.set("city", params.city);
  if (params.country) searchParams.set("country", params.country);
  if (params.countryCode) searchParams.set("country_code", params.countryCode);

  return apiFetch<WeatherData>(`/api/weather?${searchParams}`);
}

export async function searchCities(query: string): Promise<GeocodingResult[]> {
  const data = await apiFetch<{ results: GeocodingResult[] }>(
    `/api/cities?q=${encodeURIComponent(query)}`
  );
  return data.results;
}

export async function getGeoLocation(): Promise<{
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  country: string | null;
}> {
  return apiFetch(`/api/geo`);
}
