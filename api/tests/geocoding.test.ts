import { describe, it, expect, vi, beforeEach } from "vitest";
import { searchCities } from "../src/lib/geocoding";

const mockGeoResponse = {
  results: [
    { id: 1, name: "Oslo", latitude: 59.91, longitude: 10.75, country: "Norway", country_code: "NO", admin1: "Oslo" },
    { id: 2, name: "Osaka", latitude: 34.69, longitude: 135.5, country: "Japan", country_code: "JP", admin1: "Osaka" },
  ],
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("searchCities", () => {
  it("returns empty array for short queries", async () => {
    expect(await searchCities("")).toEqual([]);
    expect(await searchCities("O")).toEqual([]);
  });

  it("transforms API response to GeocodingResult array", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockGeoResponse),
    }));

    const results = await searchCities("Os");

    expect(results).toHaveLength(2);
    expect(results[0].name).toBe("Oslo");
    expect(results[0].country_code).toBe("NO");
    expect(results[0].admin1).toBe("Oslo");
    expect(results[1].name).toBe("Osaka");
  });

  it("returns empty array when API has no results", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    }));

    const results = await searchCities("xyznonexistent");
    expect(results).toEqual([]);
  });

  it("throws on API error", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      status: 503,
    }));

    await expect(searchCities("Oslo")).rejects.toThrow("Geocoding API error: 503");
  });
});
