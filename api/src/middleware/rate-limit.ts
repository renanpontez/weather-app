import type { MiddlewareHandler } from "hono";

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}


/**
 * Rate limiter backed by Durable Object storage.
 * Unlike an in-memory Map, this persists across Worker invocations.
 */
export function rateLimiter(options: RateLimitOptions): MiddlewareHandler<{
  Bindings: { WEATHER_CACHE: DurableObjectNamespace };
}> {
  return async (c, next) => {
    const ip =
      c.req.header("cf-connecting-ip") ??
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const id = c.env.WEATHER_CACHE.idFromName("global");
    const stub = c.env.WEATHER_CACHE.get(id);

    const res = await stub.fetch(
      new Request(`https://do/rate-check?ip=${encodeURIComponent(ip)}&max=${options.maxRequests}&window=${options.windowMs}`),
    );

    if (res.status === 429) {
      c.header("Retry-After", res.headers.get("Retry-After") ?? "60");
      return c.json({ error: "Too many requests" }, 429);
    }

    await next();
  };
}
