import { Hono } from "hono";
import { cors } from "hono/cors";
import { weatherRoute } from "./routes/weather";
import { citiesRoute } from "./routes/cities";
import { recentRoute } from "./routes/recent";
import { rateLimiter } from "./middleware/rate-limit";

export { WeatherCache } from "./durable-objects/weather-cache";
export { RecentSearches } from "./durable-objects/recent-searches";

export interface Env {
  WEATHER_CACHE: DurableObjectNamespace;
  RECENT_SEARCHES: DurableObjectNamespace;
  CORS_ORIGIN: string;
}

const app = new Hono<{ Bindings: Env }>();

app.use(
  "*",
  cors({
    origin: (origin, c) => {
      const allowed = c.env.CORS_ORIGIN;
      if (!origin || allowed === "*") return "*";
      return origin === allowed ? origin : "";
    },
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.use("/api/*", rateLimiter({ maxRequests: 60, windowMs: 60_000 }));

app.route("/api/weather", weatherRoute);
app.route("/api/cities", citiesRoute);
app.route("/api/recent", recentRoute);

// IP-based geolocation fallback using Cloudflare headers
app.get("/api/geo", (c) => {
  const cf = (c.req.raw as Request & { cf?: IncomingRequestCfProperties }).cf;
  return c.json({
    latitude: cf?.latitude ? parseFloat(cf.latitude as string) : null,
    longitude: cf?.longitude ? parseFloat(cf.longitude as string) : null,
    city: cf?.city ?? null,
    country: cf?.country ?? null,
  });
});

export default app;
