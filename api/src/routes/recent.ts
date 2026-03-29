import { Hono } from "hono";
import type { Env } from "../index";
import type { RecentSearchInput } from "@weather-app/shared";
import { fetchWeather } from "../lib/open-meteo";
import { getStub } from "../lib/get-stub";

export const recentRoute = new Hono<{ Bindings: Env }>();

async function resolveWeather(stub: DurableObjectStub, lat: number, lon: number): Promise<{ temperature: number; weather_code: number } | null> {
  // Try cache first
  const cacheKey = `${lat.toFixed(2)},${lon.toFixed(2)}`;
  const res = await stub.fetch(
    new Request(`https://do/cache/get?key=${cacheKey}`, { method: "GET" }),
  );

  if (res.ok) {
    const data = (await res.json()) as { current?: { temperature: number; weather_code: number } };
    if (data.current) {
      return { temperature: data.current.temperature, weather_code: data.current.weather_code };
    }
  }

  // Cache miss — fetch from API
  try {
    const fresh = await fetchWeather(lat, lon);
    return { temperature: fresh.current.temperature, weather_code: fresh.current.weather_code };
  } catch {
    return null;
  }
}

recentRoute.get("/", async (c) => {
  const stub = getStub(c.env);
  const res = await stub.fetch(new Request("https://do/recent", { method: "GET" }));
  return c.json(await res.json());
});

recentRoute.post("/", async (c) => {
  const input: RecentSearchInput = await c.req.json();
  const stub = getStub(c.env);

  const weather = await resolveWeather(stub, input.latitude, input.longitude);

  const enriched = {
    ...input,
    temperature: weather?.temperature ?? 0,
    weather_code: weather?.weather_code ?? 0,
  };

  const res = await stub.fetch(
    new Request("https://do/recent", {
      method: "POST",
      body: JSON.stringify(enriched),
    }),
  );
  return c.json(await res.json());
});

recentRoute.delete("/", async (c) => {
  const stub = getStub(c.env);
  const res = await stub.fetch(
    new Request("https://do/recent/remove", {
      method: "POST",
      body: JSON.stringify(await c.req.json()),
    }),
  );
  return c.json(await res.json());
});

recentRoute.delete("/all", async (c) => {
  const stub = getStub(c.env);
  await stub.fetch(new Request("https://do/recent/clear", { method: "POST" }));
  return c.json({ searches: [] });
});

recentRoute.get("/ws", async (c) => {
  if (c.req.header("Upgrade") !== "websocket") {
    return c.text("Expected WebSocket", 426);
  }
  const stub = getStub(c.env);
  return stub.fetch(c.req.raw);
});
