import { useState, useCallback } from "react";
import type { TemperatureUnit } from "@weather-app/shared";

const STORAGE_KEY = "weather-unit-pref";

function readPreference(): TemperatureUnit {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "fahrenheit" || stored === "celsius") return stored;
  } catch {
    // localStorage unavailable
  }
  return "celsius";
}

function writePreference(unit: TemperatureUnit) {
  try {
    localStorage.setItem(STORAGE_KEY, unit);
  } catch {
    // localStorage unavailable
  }
}

export function useUnitsPreference() {
  const [unit, setUnitState] = useState<TemperatureUnit>(readPreference);

  const toggle = useCallback(() => {
    setUnitState((prev) => {
      const next = prev === "celsius" ? "fahrenheit" : "celsius";
      writePreference(next);
      return next;
    });
  }, []);

  return { unit, toggle } as const;
}
