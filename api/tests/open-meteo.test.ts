import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchWeather } from "../src/lib/open-meteo";

const mockApiResponse = {
  current: {
    temperature_2m: 15.3,
    apparent_temperature: 12.8,
    relative_humidity_2m: 72,
    wind_speed_10m: 14.2,
    wind_direction_10m: 180,
    weather_code: 3,
    is_day: 1,
  },
  daily: {
    time: ["2026-03-28", "2026-03-29"],
    temperature_2m_max: [18.5, 20.1],
    temperature_2m_min: [8.2, 9.4],
    weather_code: [3, 61],
    precipitation_probability_max: [10, 80],
    sunrise: ["2026-03-28T06:00", "2026-03-29T05:58"],
    sunset: ["2026-03-28T18:45", "2026-03-29T18:47"],
  },
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("fetchWeather", () => {
  it("transforms API response to our schema", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    }));

    const result = await fetchWeather(59.91, 10.75);

    expect(result.current.temperature).toBe(15.3);
    expect(result.current.feels_like).toBe(12.8);
    expect(result.current.humidity).toBe(72);
    expect(result.current.wind_speed).toBe(14.2);
    expect(result.current.weather_code).toBe(3);
    expect(result.current.is_day).toBe(true);
  });

  it("maps is_day 0 to false", async () => {
    const nightResponse = {
      ...mockApiResponse,
      current: { ...mockApiResponse.current, is_day: 0 },
    };

    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(nightResponse),
    }));

    const result = await fetchWeather(59.91, 10.75);
    expect(result.current.is_day).toBe(false);
  });

  it("maps daily forecast array correctly", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockApiResponse),
    }));

    const result = await fetchWeather(59.91, 10.75);

    expect(result.daily).toHaveLength(2);
    expect(result.daily[0].date).toBe("2026-03-28");
    expect(result.daily[0].temperature_max).toBe(18.5);
    expect(result.daily[0].temperature_min).toBe(8.2);
    expect(result.daily[1].weather_code).toBe(61);
  });

  it("throws on API error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    }));

    await expect(fetchWeather(59.91, 10.75)).rejects.toThrow("Open-Meteo API error: 500");
  });
});
