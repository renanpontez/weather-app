import { useState } from "react";
import { WeatherBackground } from "./WeatherBackground";

const presets = [
  { label: "Clear (day)", code: 0, isDay: true },
  { label: "Clear (night)", code: 0, isDay: false },
  { label: "Partly cloudy", code: 2, isDay: true },
  { label: "Overcast", code: 3, isDay: true },
  { label: "Fog", code: 45, isDay: true },
  { label: "Drizzle", code: 51, isDay: true },
  { label: "Rain", code: 63, isDay: true },
  { label: "Heavy rain", code: 65, isDay: true },
  { label: "Snow", code: 73, isDay: true },
  { label: "Thunderstorm", code: 95, isDay: true },
  { label: "Thunderstorm (night)", code: 95, isDay: false },
];

export function WeatherBackgroundDemo() {
  const [active, setActive] = useState(presets[0]);

  return (
    <div className="relative min-h-screen text-white">
      <WeatherBackground weatherCode={active.code} isDay={active.isDay} />
      <div className="relative z-10 mx-auto max-w-2xl px-6 py-12">
        <h1 className="mb-8 text-3xl font-light">Background Demo</h1>
        <p className="mb-4 text-muted">
          Active: <strong className="text-white">{active.label}</strong> (code {active.code})
        </p>
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={`${p.code}-${p.isDay}`}
              onClick={() => setActive(p)}
              className={`rounded-full px-4 py-2 text-sm transition-all ${
                active === p
                  ? "bg-primary text-white"
                  : "bg-white/10 text-white/70 hover:bg-white/20"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
