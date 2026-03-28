import { renderHook, act } from "@testing-library/react";
import { useUnitsPreference } from "@/hooks/useUnitsPreference";

beforeEach(() => {
  localStorage.clear();
});

describe("useUnit", () => {
  it("defaults to celsius", () => {
    const { result } = renderHook(() => useUnitsPreference());
    expect(result.current.unit).toBe("celsius");
  });

  it("toggles between celsius and fahrenheit", () => {
    const { result } = renderHook(() => useUnitsPreference());

    act(() => result.current.toggle());
    expect(result.current.unit).toBe("fahrenheit");

    act(() => result.current.toggle());
    expect(result.current.unit).toBe("celsius");
  });

  it("persists preference to localStorage", () => {
    const { result } = renderHook(() => useUnitsPreference());

    act(() => result.current.toggle());
    expect(localStorage.getItem("weather-unit-pref")).toBe("fahrenheit");
  });

  it("reads persisted preference on mount", () => {
    localStorage.setItem("weather-unit-pref", "fahrenheit");
    const { result } = renderHook(() => useUnitsPreference());
    expect(result.current.unit).toBe("fahrenheit");
  });

  it("ignores invalid localStorage values", () => {
    localStorage.setItem("weather-unit-pref", "kelvin");
    const { result } = renderHook(() => useUnitsPreference());
    expect(result.current.unit).toBe("celsius");
  });
});
