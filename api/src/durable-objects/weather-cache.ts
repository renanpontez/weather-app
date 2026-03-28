import { DurableObject } from "cloudflare:workers";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export class WeatherCache extends DurableObject {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/get") {
      const cached = await this.ctx.storage.get<string>("data");
      const timestamp = await this.ctx.storage.get<number>("timestamp");

      if (!cached) {
        return new Response(null, { status: 404 });
      }

      const isStale = !timestamp || Date.now() - timestamp >= CACHE_TTL_MS;
      return new Response(cached, {
        headers: {
          "Content-Type": "application/json",
          "X-Cache-Stale": isStale ? "true" : "false",
        },
      });
    }

    if (url.pathname === "/set" && request.method === "POST") {
      const body = await request.text();
      await this.ctx.storage.put("data", body);
      await this.ctx.storage.put("timestamp", Date.now());

      return new Response("ok");
    }

    return new Response("Not found", { status: 404 });
  }
}
