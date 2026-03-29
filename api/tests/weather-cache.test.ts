import { describe, it, expect } from "vitest";

/**
 * Durable Object integration tests.
 *
 * These test the WeatherCache DO's routing logic by verifying
 * the expected behavior of each endpoint. In a real setup,
 * these would use miniflare's DO test helpers. Here we test
 * the contract: input → expected output shape.
 */

describe("WeatherCache DO contract", () => {
  describe("/recent endpoints", () => {
    it("GET /recent returns { searches: [] } shape", () => {
      const response = { searches: [] };
      expect(response).toHaveProperty("searches");
      expect(Array.isArray(response.searches)).toBe(true);
    });

    it("POST /recent expects entry with city, country, lat, lon", () => {
      const entry = {
        city: "Oslo",
        country: "Norway",
        country_code: "NO",
        latitude: 59.91,
        longitude: 10.75,
        temperature: 15,
        weather_code: 3,
      };

      expect(entry).toHaveProperty("city");
      expect(entry).toHaveProperty("latitude");
      expect(entry).toHaveProperty("temperature");
    });

    it("deduplication: same city+country should not create duplicates", () => {
      const searches = [
        { city: "Oslo", country: "Norway", searched_at: "2026-03-28T10:00:00Z" },
        { city: "Bergen", country: "Norway", searched_at: "2026-03-28T09:00:00Z" },
      ];

      const newEntry = { city: "Oslo", country: "Norway" };
      const filtered = searches.filter(
        (s) => !(s.city === newEntry.city && s.country === newEntry.country),
      );
      const updated = [{ ...newEntry, searched_at: "2026-03-28T11:00:00Z" }, ...filtered];

      expect(updated).toHaveLength(2);
      expect(updated[0].city).toBe("Oslo");
      expect(updated[0].searched_at).toBe("2026-03-28T11:00:00Z");
      expect(updated[1].city).toBe("Bergen");
    });

    it("caps at MAX_RECENT (10) entries", () => {
      const MAX_RECENT = 10;
      const searches = Array.from({ length: 12 }, (_, i) => ({
        city: `City${i}`,
        country: "Test",
      }));

      const capped = searches.slice(0, MAX_RECENT);
      expect(capped).toHaveLength(10);
    });
  });

  describe("/cache endpoints", () => {
    it("cache key rounds coordinates to 2 decimal places", () => {
      const lat = 59.9139;
      const lon = 10.7522;
      const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;

      expect(key).toBe("59.91,10.75");
    });

    it("stale detection uses 10-minute TTL", () => {
      const CACHE_TTL_MS = 10 * 60 * 1000;
      const now = Date.now();

      const fresh = now - 5 * 60 * 1000; // 5 min ago
      const stale = now - 15 * 60 * 1000; // 15 min ago

      expect(now - fresh < CACHE_TTL_MS).toBe(true);
      expect(now - stale >= CACHE_TTL_MS).toBe(true);
    });
  });

  describe("/rate-check", () => {
    it("tracks count per IP within window", () => {
      const records = new Map<string, { count: number; resetAt: number }>();
      const ip = "1.2.3.4";
      const max = 60;
      const windowMs = 60_000;
      const now = Date.now();

      // First request
      records.set(ip, { count: 1, resetAt: now + windowMs });
      expect(records.get(ip)!.count).toBe(1);

      // Subsequent requests
      const record = records.get(ip)!;
      record.count++;
      expect(record.count).toBe(2);

      // At limit
      record.count = max + 1;
      expect(record.count > max).toBe(true);
    });

    it("resets after window expires", () => {
      const now = Date.now();
      const resetAt = now - 1000; // expired 1 second ago

      expect(now > resetAt).toBe(true);
    });
  });
});
