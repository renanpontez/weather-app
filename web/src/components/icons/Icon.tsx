import type { ReactNode } from "react";
import { ClearDay } from "./ClearDay";
import { ClearNight } from "./ClearNight";
import { PartlyCloudy } from "./PartlyCloudy";
import { Overcast } from "./Overcast";
import { Fog } from "./Fog";
import { Drizzle } from "./Drizzle";
import { Rain } from "./Rain";
import { Snow } from "./Snow";
import { Thunderstorm } from "./Thunderstorm";

interface IconProps {
  name: string;
  size?: number;
  className?: string;
  label?: string;
}

const registry: Record<string, () => ReactNode> = {
  "clear-day": ClearDay,
  "clear-night": ClearNight,
  "partly-cloudy": PartlyCloudy,
  overcast: Overcast,
  fog: Fog,
  drizzle: Drizzle,
  rain: Rain,
  snow: Snow,
  thunderstorm: Thunderstorm,
};

const ALIASES: Record<string, string> = {
  clear: "clear-day",
  "mostly-clear": "clear-day",
  "heavy-rain": "rain",
  "freezing-drizzle": "drizzle",
  "freezing-rain": "rain",
  "rain-showers": "rain",
  "heavy-snow": "snow",
};

export function Icon({ name, size = 24, className = "", label }: IconProps) {
  const resolved = ALIASES[name] ?? name;
  const Glyph = registry[resolved] ?? registry["overcast"];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      className={className}
      role={label ? "img" : "presentation"}
      aria-label={label}
      aria-hidden={!label}
    >
      <Glyph />
    </svg>
  );
}
