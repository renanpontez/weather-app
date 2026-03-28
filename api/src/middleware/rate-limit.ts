import type { MiddlewareHandler } from "hono";

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

const ipRequestCounts = new Map<string, { count: number; resetAt: number }>();

export function rateLimiter(options: RateLimitOptions): MiddlewareHandler {
  return async (c, next) => {
    const ip =
      c.req.header("cf-connecting-ip") ??
      c.req.header("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";

    const now = Date.now();
    const record = ipRequestCounts.get(ip);

    if (!record || now > record.resetAt) {
      ipRequestCounts.set(ip, { count: 1, resetAt: now + options.windowMs });
    } else {
      record.count++;
      if (record.count > options.maxRequests) {
        c.header("Retry-After", String(Math.ceil((record.resetAt - now) / 1000)));
        return c.json({ error: "Too many requests" }, 429);
      }
    }

    await next();
  };
}
