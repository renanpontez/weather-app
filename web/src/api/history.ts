import type { RecentSearch, RecentSearchInput } from "@weather-app/shared";
import { apiFetch } from "./http";

export async function getRecentSearches(): Promise<RecentSearch[]> {
  const data = await apiFetch<{ searches: RecentSearch[] }>("/api/recent");
  return data.searches;
}

export async function addRecentSearch(input: RecentSearchInput): Promise<RecentSearch[]> {
  const data = await apiFetch<{ searches: RecentSearch[] }>("/api/recent", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.searches;
}

export async function removeRecentSearch(city: string, country: string): Promise<RecentSearch[]> {
  const data = await apiFetch<{ searches: RecentSearch[] }>("/api/recent", {
    method: "DELETE",
    body: JSON.stringify({ city, country }),
  });
  return data.searches;
}

export async function clearRecentSearches(): Promise<void> {
  await apiFetch("/api/recent/all", { method: "DELETE" });
}
