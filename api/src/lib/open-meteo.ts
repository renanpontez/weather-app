import type { CurrentWeather, DailyForecast } from "@weather-app/shared";

const BASE_URL = "https://api.open-meteo.com/v1";

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_probability_max: number[];
    sunrise: string[];
    sunset: string[];
  };
}

export async function fetchWeather(
  lat: number,
  lon: number
): Promise<{
  current: CurrentWeather;
  daily: DailyForecast[];
}> {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: [
      "temperature_2m",
      "apparent_temperature",
      "relative_humidity_2m",
      "wind_speed_10m",
      "wind_direction_10m",
      "weather_code",
      "is_day",
    ].join(","),
    daily: [
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "precipitation_probability_max",
      "sunrise",
      "sunset",
    ].join(","),
    timezone: "auto",
    past_days: "1",
    forecast_days: "7",
  });

  const res = await fetch(`${BASE_URL}/forecast?${params}`);
  if (!res.ok) {
    throw new Error(`Open-Meteo API error: ${res.status}`);
  }

  const data: OpenMeteoResponse = await res.json();

  return {
    current: {
      temperature: data.current.temperature_2m,
      feels_like: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      wind_speed: data.current.wind_speed_10m,
      wind_direction: data.current.wind_direction_10m,
      weather_code: data.current.weather_code,
      is_day: data.current.is_day === 1,
    },
    daily: data.daily.time.map((date, i) => ({
      date,
      temperature_max: data.daily.temperature_2m_max[i],
      temperature_min: data.daily.temperature_2m_min[i],
      weather_code: data.daily.weather_code[i],
      precipitation_probability_max: data.daily.precipitation_probability_max[i],
      sunrise: data.daily.sunrise[i],
      sunset: data.daily.sunset[i],
    })),
  };
}
