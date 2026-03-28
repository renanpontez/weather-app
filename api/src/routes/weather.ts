import { Hono } from "hono";
import type { Env } from "../index";
import { fetchWeather } from "../lib/open-meteo";

export const weatherRoute = new Hono<{ Bindings: Env }>();

function getStub(env: Env) {
  const id = env.WEATHER_CACHE.idFromName("global");
  return env.WEATHER_CACHE.get(id);
}

async function refreshCache(
  stub: DurableObjectStub,
  cacheKey: string,
  lat: number,
  lon: number,
  meta: { city: string; country: string; country_code: string },
) {
  const weather = await fetchWeather(lat, lon);
  const result = {
    latitude: lat,
    longitude: lon,
    ...meta,
    ...weather,
    cached_at: new Date().toISOString(),
  };
  await stub.fetch(
    new Request(`https://do/cache/set?key=${cacheKey}`, {
      method: "POST",
      body: JSON.stringify(result),
    }),
  );
}

weatherRoute.get("/", async (c) => {
  const lat = c.req.query("lat");
  const lon = c.req.query("lon");
  const city = c.req.query("city") ?? "Unknown";
  const country = c.req.query("country") ?? "";
  const countryCode = c.req.query("country_code") ?? "";

  if (!lat || !lon) {
    return c.json({ error: "lat and lon are required" }, 400);
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);

  if (isNaN(latitude) || isNaN(longitude)) {
    return c.json({ error: "lat and lon must be valid numbers" }, 400);
  }

  const cacheKey = `${latitude.toFixed(2)},${longitude.toFixed(2)}`;
  const stub = getStub(c.env);

  const cacheResponse = await stub.fetch(
    new Request(`https://do/cache/get?key=${cacheKey}`, { method: "GET" }),
  );

  if (cacheResponse.ok) {
    const isStale = cacheResponse.headers.get("X-Cache-Stale") === "true";
    const cached = (await cacheResponse.json()) as Record<string, unknown>;
    const result = { ...cached, city, country, country_code: countryCode };

    if (isStale) {
      c.executionCtx.waitUntil(
        refreshCache(stub, cacheKey, latitude, longitude, { city, country, country_code: countryCode }),
      );
    }

    return c.json(result);
  }

  // Cache miss — fetch fresh
  const weather = await fetchWeather(latitude, longitude);
  const result = {
    latitude,
    longitude,
    city,
    country,
    country_code: countryCode,
    ...weather,
    cached_at: new Date().toISOString(),
  };

  await stub.fetch(
    new Request(`https://do/cache/set?key=${cacheKey}`, {
      method: "POST",
      body: JSON.stringify(result),
    }),
  );

  return c.json(result);
});
