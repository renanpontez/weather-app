import { convertTemp, formatTemperature, formatWindSpeed, formatDay, timeAgo, todayDateString } from "@/lib/format";

describe("convertTemp", () => {
  it("returns rounded celsius", () => {
    expect(convertTemp(15.4, "celsius")).toBe(15);
    expect(convertTemp(15.6, "celsius")).toBe(16);
  });

  it("converts to fahrenheit", () => {
    expect(convertTemp(0, "fahrenheit")).toBe(32);
    expect(convertTemp(100, "fahrenheit")).toBe(212);
    expect(convertTemp(20, "fahrenheit")).toBe(68);
  });
});

describe("formatTemperature", () => {
  it("formats celsius with unit", () => {
    expect(formatTemperature(15, "celsius")).toBe("15°C");
  });

  it("formats fahrenheit with unit", () => {
    expect(formatTemperature(0, "fahrenheit")).toBe("32°F");
  });
});

describe("formatWindSpeed", () => {
  it("formats with km/h", () => {
    expect(formatWindSpeed(12.7)).toBe("13 km/h");
    expect(formatWindSpeed(0)).toBe("0 km/h");
  });
});

describe("formatDay", () => {
  it("returns short weekday name", () => {
    const result = formatDay("2026-03-28");
    expect(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]).toContain(result);
  });
});

describe("todayDateString", () => {
  it("returns YYYY-MM-DD format", () => {
    expect(todayDateString()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("timeAgo", () => {
  it("returns 'just now' for recent timestamps", () => {
    expect(timeAgo(new Date().toISOString())).toBe("just now");
  });

  it("returns minutes ago", () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60_000).toISOString();
    expect(timeAgo(fiveMinAgo)).toBe("5m ago");
  });

  it("returns hours ago", () => {
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60_000).toISOString();
    expect(timeAgo(twoHoursAgo)).toBe("2h ago");
  });

  it("returns days ago", () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60_000).toISOString();
    expect(timeAgo(threeDaysAgo)).toBe("3d ago");
  });
});
