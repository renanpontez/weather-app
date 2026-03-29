import { render, screen } from "@testing-library/react";
import { MainWeather } from "@/components/weather/MainWeather";
import { formatTemperature, formatWindSpeed, todayDateString } from "@/lib/format";
import type { WeatherData } from "@weather-app/shared";

const mockWeather: WeatherData = {
  latitude: 59.91,
  longitude: 10.75,
  city: "Oslo",
  country: "Norway",
  country_code: "NO",
  current: {
    temperature: 15,
    feels_like: 13,
    humidity: 72,
    wind_speed: 12,
    wind_direction: 180,
    weather_code: 2,
    is_day: true,
  },
  daily: [
    {
      date: todayDateString(),
      temperature_max: 19,
      temperature_min: 8,
      weather_code: 2,
      precipitation_probability_max: 10,
      sunrise: "",
      sunset: "",
    },
  ],
};

describe("WeatherDisplay", () => {
  it("shows loading skeleton when loading", () => {
    render(
      <MainWeather weather={null} unit="celsius" loading={true} />,
    );
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });

  it("shows empty state when no weather data", () => {
    render(
      <MainWeather weather={null} unit="celsius" loading={false} />,
    );
    expect(screen.getByText(/Search for a city/)).toBeInTheDocument();
  });

  it("renders city name and temperature", () => {
    render(
      <MainWeather weather={mockWeather} unit="celsius" loading={false} />,
    );
    const tempValue = Math.round(mockWeather.current.temperature);
    expect(screen.getByText(mockWeather.city)).toBeInTheDocument();
    expect(screen.getByText(`${tempValue}°`)).toBeInTheDocument();
  });

  it("converts to fahrenheit", () => {
    render(
      <MainWeather weather={mockWeather} unit="fahrenheit" loading={false} />,
    );
    const tempF = Math.round(mockWeather.current.temperature * 9 / 5 + 32);
    expect(screen.getByText(`${tempF}°`)).toBeInTheDocument();
  });

  it("shows hi/lo when today's daily data exists", () => {
    render(
      <MainWeather weather={mockWeather} unit="celsius" loading={false} />,
    );
    const today = mockWeather.daily[0];
    expect(screen.getByText(formatTemperature(today.temperature_max, "celsius"))).toBeInTheDocument();
    expect(screen.getByText(formatTemperature(today.temperature_min, "celsius"))).toBeInTheDocument();
  });

  it("shows weather details (feels like, humidity, wind)", () => {
    render(
      <MainWeather weather={mockWeather} unit="celsius" loading={false} />,
    );
    expect(screen.getByText(formatTemperature(mockWeather.current.feels_like, "celsius"))).toBeInTheDocument();
    expect(screen.getByText(`${mockWeather.current.humidity}%`)).toBeInTheDocument();
    expect(screen.getByText(formatWindSpeed(mockWeather.current.wind_speed))).toBeInTheDocument();
  });

  it("has rich aria-label with weather details", () => {
    render(
      <MainWeather weather={mockWeather} unit="celsius" loading={false} />,
    );
    const article = screen.getByRole("article");
    const label = article.getAttribute("aria-label")!;
    expect(label).toContain(mockWeather.city);
    expect(label).toContain(formatTemperature(mockWeather.current.temperature, "celsius"));
    expect(label).toContain(`${mockWeather.current.humidity}%`);
    expect(label).toContain("feels like");
    expect(label).toContain("wind");
  });
});
