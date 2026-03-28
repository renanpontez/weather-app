import { DurableObject } from "cloudflare:workers";
import type { RecentSearch } from "@weather-app/shared";

const MAX_RECENT = 10;

export class RecentSearches extends DurableObject {
  private sessions: Set<WebSocket> = new Set();

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/list") {
      const searches = (await this.ctx.storage.get<RecentSearch[]>("searches")) ?? [];
      return Response.json({ searches });
    }

    if (url.pathname === "/add" && request.method === "POST") {
      const entry: RecentSearch = await request.json();
      entry.searched_at = new Date().toISOString();

      const searches = (await this.ctx.storage.get<RecentSearch[]>("searches")) ?? [];

      // Remove duplicate (same city + country)
      const filtered = searches.filter(
        (s) => !(s.city === entry.city && s.country === entry.country)
      );

      // Prepend and cap
      const updated = [entry, ...filtered].slice(0, MAX_RECENT);
      await this.ctx.storage.put("searches", updated);

      // Broadcast to all WebSocket clients
      this.broadcast(JSON.stringify({ type: "update", searches: updated }));

      return Response.json({ searches: updated });
    }

    if (url.pathname === "/remove" && request.method === "POST") {
      const { city, country } = await request.json() as { city: string; country: string };
      const searches = (await this.ctx.storage.get<RecentSearch[]>("searches")) ?? [];
      const updated = searches.filter(
        (s) => !(s.city === city && s.country === country)
      );
      await this.ctx.storage.put("searches", updated);
      this.broadcast(JSON.stringify({ type: "update", searches: updated }));
      return Response.json({ searches: updated });
    }

    if (url.pathname === "/clear" && request.method === "POST") {
      await this.ctx.storage.put("searches", []);
      this.broadcast(JSON.stringify({ type: "update", searches: [] }));
      return Response.json({ searches: [] });
    }

    // WebSocket upgrade
    if (request.headers.get("Upgrade") === "websocket") {
      const pair = new WebSocketPair();
      const [client, server] = Object.values(pair);

      this.ctx.acceptWebSocket(server);
      this.sessions.add(server);

      // Send current state on connect
      const searches = (await this.ctx.storage.get<RecentSearch[]>("searches")) ?? [];
      server.send(JSON.stringify({ type: "init", searches }));

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

  private broadcast(message: string) {
    for (const ws of this.sessions) {
      try {
        ws.send(message);
      } catch {
        this.sessions.delete(ws);
      }
    }
  }
}
