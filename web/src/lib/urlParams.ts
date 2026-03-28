import type { TemperatureUnit } from "@weather-app/shared";

export interface UrlState {
  lat?: number;
  lon?: number;
  city?: string;
  unit?: TemperatureUnit;
}

export function getUrlParams(): UrlState {
  const params = new URLSearchParams(window.location.search);
  const lat = params.get("lat");
  const lon = params.get("lon");
  const city = params.get("city");
  const unit = params.get("unit");

  const latNum = lat ? parseFloat(lat) : NaN;
  const lonNum = lon ? parseFloat(lon) : NaN;

  return {
    lat: !isNaN(latNum) ? latNum : undefined,
    lon: !isNaN(lonNum) ? lonNum : undefined,
    city: city ?? undefined,
    unit:
      unit === "fahrenheit"
        ? "fahrenheit"
        : unit === "celsius"
          ? "celsius"
          : undefined,
  };
}

export function setUrlParams(state: UrlState): void {
  const params = new URLSearchParams();
  if (state.lat !== undefined) params.set("lat", String(state.lat));
  if (state.lon !== undefined) params.set("lon", String(state.lon));
  if (state.city) params.set("city", state.city);
  if (state.unit) params.set("unit", state.unit);

  const newUrl = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState(null, "", newUrl);
}
