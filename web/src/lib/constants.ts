export const API_BASE_URL = import.meta.env.VITE_API_URL ?? "";

export const DEFAULT_CITY = {
  name: "Oslo",
  latitude: 59.9139,
  longitude: 10.7522,
  country: "Norge",
  country_code: "NO",
} as const;

export const DEBOUNCE_MS = 300;
