export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  admin1?: string; // State/province
}

export interface WeatherData {
  latitude: number;
  longitude: number;
  city: string;
  country: string;
  country_code: string;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  cached_at?: string;
}

export interface CurrentWeather {
  temperature: number;
  feels_like: number;
  humidity: number;
  wind_speed: number;
  wind_direction: number;
  weather_code: number;
  is_day: boolean;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weather_code: number;
  precipitation_probability: number;
}

export interface DailyForecast {
  date: string;
  temperature_max: number;
  temperature_min: number;
  weather_code: number;
  precipitation_probability_max: number;
  sunrise: string;
  sunset: string;
}

export interface RecentSearch {
  city: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  temperature: number;
  weather_code: number;
  searched_at: string;
}

export type RecentSearchInput = Pick<RecentSearch, "city" | "country" | "country_code" | "latitude" | "longitude">;

export type TemperatureUnit = "celsius" | "fahrenheit";

export interface CitySearchParams {
  q: string;
}

export interface WeatherParams {
  lat: number;
  lon: number;
  city?: string;
  country?: string;
  country_code?: string;
}

// WMO Weather interpretation codes
// https://open-meteo.com/en/docs
export const WEATHER_CODES: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "clear" },
  1: { label: "Mainly clear", icon: "mostly-clear" },
  2: { label: "Partly cloudy", icon: "partly-cloudy" },
  3: { label: "Overcast", icon: "overcast" },
  45: { label: "Foggy", icon: "fog" },
  48: { label: "Depositing rime fog", icon: "fog" },
  51: { label: "Light drizzle", icon: "drizzle" },
  53: { label: "Moderate drizzle", icon: "drizzle" },
  55: { label: "Dense drizzle", icon: "drizzle" },
  56: { label: "Light freezing drizzle", icon: "freezing-drizzle" },
  57: { label: "Dense freezing drizzle", icon: "freezing-drizzle" },
  61: { label: "Slight rain", icon: "rain" },
  63: { label: "Moderate rain", icon: "rain" },
  65: { label: "Heavy rain", icon: "heavy-rain" },
  66: { label: "Light freezing rain", icon: "freezing-rain" },
  67: { label: "Heavy freezing rain", icon: "freezing-rain" },
  71: { label: "Slight snow", icon: "snow" },
  73: { label: "Moderate snow", icon: "snow" },
  75: { label: "Heavy snow", icon: "heavy-snow" },
  77: { label: "Snow grains", icon: "snow" },
  80: { label: "Slight rain showers", icon: "rain-showers" },
  81: { label: "Moderate rain showers", icon: "rain-showers" },
  82: { label: "Violent rain showers", icon: "heavy-rain" },
  85: { label: "Slight snow showers", icon: "snow" },
  86: { label: "Heavy snow showers", icon: "heavy-snow" },
  95: { label: "Thunderstorm", icon: "thunderstorm" },
  96: { label: "Thunderstorm with slight hail", icon: "thunderstorm" },
  99: { label: "Thunderstorm with heavy hail", icon: "thunderstorm" },
};
