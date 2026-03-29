import type { Env } from "../index";

export function getStub(env: Env) {
  const id = env.WEATHER_CACHE.idFromName("global");
  return env.WEATHER_CACHE.get(id);
}
