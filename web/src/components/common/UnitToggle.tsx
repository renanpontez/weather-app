import type { TemperatureUnit } from "@weather-app/shared";

interface UnitToggleProps {
  unit: TemperatureUnit;
  onToggle: () => void;
}

export function UnitToggle({ unit, onToggle }: UnitToggleProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={`Switch to ${unit === "celsius" ? "Fahrenheit" : "Celsius"}`}
      className="flex cursor-pointer items-center gap-1 rounded-full border border-white/10 bg-surface px-3 py-2.5 text-sm transition-all hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <span className={unit === "celsius" ? "font-medium text-primary" : "text-muted"}>°C</span>
      <span className="text-muted/40">/</span>
      <span className={unit === "fahrenheit" ? "font-medium text-primary" : "text-muted"}>°F</span>
    </button>
  );
}
