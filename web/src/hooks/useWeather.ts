import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { WeatherData } from "@weather-app/shared";
import { getWeather } from "@/api/forecast";
import { queryKeys } from "@/api/queryKeys";

export interface WeatherParams {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  countryCode?: string;
}

export function useWeather(params: WeatherParams | null) {
  return useQuery<WeatherData>({
    queryKey: queryKeys.weather(params?.lat, params?.lon),
    queryFn: () => {
      if (!params) throw new Error("Missing weather params");
      return getWeather(params);
    },
    enabled: !!params,
    placeholderData: keepPreviousData,
  });
}
