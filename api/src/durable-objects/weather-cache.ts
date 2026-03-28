import { DurableObject } from "cloudflare:workers";
import type { RecentSearch } from "@weather-app/shared";

const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const MAX_RECENT = 10;

export class WeatherCache extends DurableObject {
  private sessions: Set<WebSocket> = new Set();

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

    // --- Weather cache ---

    if (url.pathname === "/cache/get") {
      const key = url.searchParams.get("key");
      if (!key) return new Response(null, { status: 400 });

      const cached = await this.ctx.storage.get<string>(`cache:${key}`);
      const timestamp = await this.ctx.storage.get<number>(`ts:${key}`);

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
      await this.ctx.storage.put(`cache:${key}`, body);
      await this.ctx.storage.put(`ts:${key}`, Date.now());
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
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      this.ctx.acceptWebSocket(server);
      this.sessions.add(server);

      server.send(JSON.stringify({ type: "init", searches: await this.getRecent() }));
      return new Response(null, { status: 101, webSocket: client });
    }

    return new Response("Not found", { status: 404 });
  }

  webSocketClose(ws: WebSocket) {
    this.sessions.delete(ws);
  }

  webSocketError(ws: WebSocket) {
    this.sessions.delete(ws);
  }

  private broadcast(data: Record<string, unknown>) {
    const message = JSON.stringify(data);
    for (const ws of this.sessions) {
      try {
        ws.send(message);
      } catch {
        this.sessions.delete(ws);
      }
    }
  }
}
