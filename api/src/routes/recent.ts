import { Hono } from "hono";
import type { Env } from "../index";

export const recentRoute = new Hono<{ Bindings: Env }>();

// Get recent searches
recentRoute.get("/", async (c) => {
  const id = c.env.RECENT_SEARCHES.idFromName("global");
  const stub = c.env.RECENT_SEARCHES.get(id);

  const res = await stub.fetch(
    new Request("https://do/list", { method: "GET" })
  );
  const data = await res.json();
  return c.json(data);
});

// Add a recent search
recentRoute.post("/", async (c) => {
  const body = await c.req.json();
  const id = c.env.RECENT_SEARCHES.idFromName("global");
  const stub = c.env.RECENT_SEARCHES.get(id);

  const res = await stub.fetch(
    new Request("https://do/add", {
      method: "POST",
      body: JSON.stringify(body),
    })
  );
  const data = await res.json();
  return c.json(data);
});

// Remove a single recent search
recentRoute.delete("/", async (c) => {
  const body = await c.req.json();
  const id = c.env.RECENT_SEARCHES.idFromName("global");
  const stub = c.env.RECENT_SEARCHES.get(id);

  const res = await stub.fetch(
    new Request("https://do/remove", {
      method: "POST",
      body: JSON.stringify(body),
    })
  );
  const data = await res.json();
  return c.json(data);
});

// Clear all recent searches
recentRoute.delete("/all", async (c) => {
  const id = c.env.RECENT_SEARCHES.idFromName("global");
  const stub = c.env.RECENT_SEARCHES.get(id);

  await stub.fetch(new Request("https://do/clear", { method: "POST" }));
  return c.json({ searches: [] });
});

// WebSocket for real-time sync
recentRoute.get("/ws", async (c) => {
  const upgradeHeader = c.req.header("Upgrade");
  if (upgradeHeader !== "websocket") {
    return c.text("Expected WebSocket", 426);
  }

  const id = c.env.RECENT_SEARCHES.idFromName("global");
  const stub = c.env.RECENT_SEARCHES.get(id);

  return stub.fetch(c.req.raw);
});
