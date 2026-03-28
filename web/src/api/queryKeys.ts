export const queryKeys = {
  weather: (lat?: number, lon?: number) => ["weather", lat, lon] as const,
  cities: (query: string) => ["cities", query] as const,
  recent: () => ["recent"] as const,
}
