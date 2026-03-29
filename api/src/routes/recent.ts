import { Hono } from "hono";
import { z } from "zod";
import type { Env } from "../index";
import { fetchWeather } from "../lib/open-meteo";
import { getStub } from "../lib/get-stub";

export const recentRoute = new Hono<{ Bindings: Env }>();

const RecentInput = z.object({
  city: z.string().max(100),
  country: z.string().max(100),
  country_code: z.string().length(2),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const RemoveInput = z.object({
  city: z.string().max(100),
  country: z.string().max(100),
});

async function resolveWeather(
  stub: DurableObjectStub,
  lat: number,
  lon: number,
): Promise<{ temperature: number; weather_code: number } | null> {
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
  const parsed = RecentInput.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Invalid input" }, 400);
  const input = parsed.data;
  const stub = getStub(c.env);
  const weather = await resolveWeather(stub, input.latitude, input.longitude);

  const res = await stub.fetch(
    new Request("https://do/recent", {
      method: "POST",
      body: JSON.stringify({
        ...input,
        temperature: weather?.temperature ?? 0,
        weather_code: weather?.weather_code ?? 0,
      }),
    }),
  );
  return c.json(await res.json());
});

recentRoute.delete("/", async (c) => {
  const parsed = RemoveInput.safeParse(await c.req.json());
  if (!parsed.success) return c.json({ error: "Invalid input" }, 400);
  const input = parsed.data;
  const stub = getStub(c.env);
  const res = await stub.fetch(
    new Request("https://do/recent/remove", {
      method: "POST",
      body: JSON.stringify(input),
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
