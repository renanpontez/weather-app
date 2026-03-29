import { DurableObject } from "cloudflare:workers";
import type { RecentSearch } from "@weather-app/shared";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours — dead cache cleanup
const MAX_RECENT = 10;
const MAX_WS_CONNECTIONS = 100;
const CLEANUP_INTERVAL_MS = 60 * 60 * 1000; // 1 hour

interface WeatherCacheEnv {
  CORS_ORIGIN: string;
}

export class WeatherCache extends DurableObject<WeatherCacheEnv> {
  // --- Storage helpers ---

  private async getRecent(): Promise<RecentSearch[]> {
    return (await this.ctx.storage.get<RecentSearch[]>("recent")) ?? [];
  }

  private async setRecent(searches: RecentSearch[]): Promise<void> {
    await this.ctx.storage.put("recent", searches);
    this.broadcast({ type: "update", searches });
  }

  private respondRecent(searches: RecentSearch[]) {
    return Response.json({ searches });
  }

  // --- Routing ---

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // --- Rate limiting ---

    if (url.pathname === "/rate-check") {
      const ip = url.searchParams.get("ip") ?? "unknown";
      const max = parseInt(url.searchParams.get("max") ?? "60", 10);
      const windowMs = parseInt(url.searchParams.get("window") ?? "60000", 10);

      const key = `rate:${ip}`;
      const now = Date.now();
      const record = await this.ctx.storage.get<{ count: number; resetAt: number }>(key);

      if (!record || now > record.resetAt) {
        await this.ctx.storage.put(key, { count: 1, resetAt: now + windowMs });
        this.scheduleCleanup();
        return new Response("ok");
      }

      record.count++;
      await this.ctx.storage.put(key, record);

      if (record.count > max) {
        return new Response(null, {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((record.resetAt - now) / 1000)) },
        });
      }

      return new Response("ok");
    }

    // --- Weather cache ---

    if (url.pathname === "/cache/get") {
      const key = url.searchParams.get("key");
      if (!key) return new Response(null, { status: 400 });

      const entries = await this.ctx.storage.get<string | number>([`cache:${key}`, `ts:${key}`]);
      const cached = entries.get(`cache:${key}`) as string | undefined;
      const timestamp = entries.get(`ts:${key}`) as number | undefined;

      if (!cached) return new Response(null, { status: 404 });

      const isStale = !timestamp || Date.now() - timestamp >= CACHE_TTL_MS;
      return new Response(cached, {
        headers: {
          "Content-Type": "application/json",
          "X-Cache-Stale": isStale ? "true" : "false",
        },
      });
    }

    if (url.pathname === "/cache/set" && request.method === "POST") {
      const key = url.searchParams.get("key");
      if (!key) return new Response(null, { status: 400 });

      const body = await request.text();
      await this.ctx.storage.put({
        [`cache:${key}`]: body,
        [`ts:${key}`]: Date.now(),
      });
      return new Response("ok");
    }

    // --- Recent searches ---

    if (url.pathname === "/recent" && request.method === "GET") {
      return this.respondRecent(await this.getRecent());
    }

    if (url.pathname === "/recent" && request.method === "POST") {
      const entry: RecentSearch = await request.json();
      entry.searched_at = new Date().toISOString();

      const current = await this.getRecent();
      const filtered = current.filter(
        (s) => !(s.city === entry.city && s.country === entry.country),
      );
      const updated = [entry, ...filtered].slice(0, MAX_RECENT);
      await this.setRecent(updated);
      return this.respondRecent(updated);
    }

    if (url.pathname === "/recent/remove" && request.method === "POST") {
      const { city, country } = (await request.json()) as { city: string; country: string };
      const updated = (await this.getRecent()).filter(
        (s) => !(s.city === city && s.country === country),
      );
      await this.setRecent(updated);
      return this.respondRecent(updated);
    }

    if (url.pathname === "/recent/clear" && request.method === "POST") {
      await this.setRecent([]);
      return this.respondRecent([]);
    }

    // --- WebSocket ---

    if (request.headers.get("Upgrade") === "websocket") {
      // Origin check
      const origin = request.headers.get("Origin");
      if (origin && origin !== this.env.CORS_ORIGIN) {
        return new Response("Forbidden", { status: 403 });
      }

      // Connection cap
      const sockets = this.ctx.getWebSockets();
      if (sockets.length >= MAX_WS_CONNECTIONS) {
        return new Response("Too many connections", { status: 503 });
      }

      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      this.ctx.acceptWebSocket(server);

      server.send(JSON.stringify({ type: "init", searches: await this.getRecent() }));
      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response("Not found", { status: 404 });
  }

  // --- Periodic cleanup of expired keys ---

  async alarm() {
    const now = Date.now();
    const allKeys = await this.ctx.storage.list();
    const toDelete: string[] = [];

    for (const [key, value] of allKeys) {
      if (key.startsWith("rate:") && (value as { resetAt: number }).resetAt < now) {
        toDelete.push(key);
      }
      if (key.startsWith("ts:") && now - (value as number) > CACHE_EXPIRY_MS) {
        toDelete.push(key);
        toDelete.push(key.replace("ts:", "cache:"));
      }
    }

    if (toDelete.length) {
      await this.ctx.storage.delete(toDelete);
      console.log(`[Cleanup] Deleted ${toDelete.length} expired keys`);
    }

    this.scheduleCleanup();
  }

  private scheduleCleanup() {
    this.ctx.storage.setAlarm(Date.now() + CLEANUP_INTERVAL_MS);
  }

  webSocketClose(_ws: WebSocket) {}

  webSocketError(_ws: WebSocket) {
    console.warn(`[WS] Connection error. Remaining: ${this.ctx.getWebSockets().length}`);
  }

  private broadcast(data: Record<string, unknown>) {
    const sockets = this.ctx.getWebSockets();
    const message = JSON.stringify(data);
    let sent = 0;
    for (const ws of sockets) {
      try {
        ws.send(message);
        sent++;
      } catch {
        // Dead socket — runtime will clean it up
      }
    }
  }
}
