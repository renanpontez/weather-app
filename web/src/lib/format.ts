import type { TemperatureUnit } from "@weather-app/shared";

export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === "fahrenheit") return Math.round(celsius * 9 / 5 + 32);
  return Math.round(celsius);
}

export function formatTemperature(celsius: number, unit: TemperatureUnit): string {
  return `${convertTemp(celsius, unit)}°${unit === "fahrenheit" ? "F" : "C"}`;
}

export function formatWindSpeed(kmh: number): string {
  return `${Math.round(kmh)} km/h`;
}

export function formatTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function todayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

export function formatDay(dateString: string): string {
  return new Date(dateString + "T12:00:00").toLocaleDateString("en-US", { weekday: "short" });
}

export function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
