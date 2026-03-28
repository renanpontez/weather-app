import { Hono } from "hono";
import type { Env } from "../index";
import { searchCities } from "../lib/geocoding";

export const citiesRoute = new Hono<{ Bindings: Env }>();

citiesRoute.get("/", async (c) => {
  const query = c.req.query("q");

  if (!query || query.length < 2) {
    return c.json({ results: [] });
  }

  try {
    const results = await searchCities(query);
    return c.json({ results });
  } catch {
    return c.json({ error: "Failed to search cities" }, 502);
  }
});
