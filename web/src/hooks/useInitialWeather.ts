import { useMemo, useState, useCallback } from "react";
import type { TemperatureUnit } from "@weather-app/shared";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather, type WeatherParams } from "@/hooks/useWeather";
import { getUrlParams, setUrlParams } from "@/lib/urlParams";

export function useInitialWeather() {
  const geo = useGeolocation();
  const [initialUrlState] = useState(() => getUrlParams());
  const [selected, setSelected] = useState<WeatherParams | null>(null);

  const params = useMemo<WeatherParams | null>(() => {
    if (selected) return selected;

    if (initialUrlState.lat && initialUrlState.lon) {
      return {
        lat: initialUrlState.lat,
        lon: initialUrlState.lon,
        city: initialUrlState.city,
      };
    }

    if (!geo.loading) {
      return {
        lat: geo.latitude,
        lon: geo.longitude,
        city: geo.city ?? undefined,
      };
    }

    return null;
  }, [selected, initialUrlState, geo.loading, geo.latitude, geo.longitude, geo.city]);

  const query = useWeather(params);

  const selectLocation = useCallback((p: WeatherParams, unit?: TemperatureUnit) => {
    setUrlParams({ lat: p.lat, lon: p.lon, city: p.city, unit });
    setSelected(p);
  }, []);

  return {
    weather: query.data ?? null,
    isLoading: query.isLoading || geo.loading,
    error: query.error,
    geoError: geo.error,
    selectLocation,
  };
}
