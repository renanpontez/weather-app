import type { WeatherData, TemperatureUnit } from "@weather-app/shared";
import { WEATHER_CODES } from "@weather-app/shared";
import { convertTemp, formatTemperature, formatWindSpeed, todayDateString } from "@/lib/format";
import { WeatherIcon } from "@/components/common/WeatherIcon";
import { MainWeatherSkeleton } from "./MainWeatherSkeleton";

interface MainWeatherProps {
  weather: WeatherData | null;
  unit: TemperatureUnit;
  loading: boolean;
}

export function MainWeather({ weather, unit, loading }: MainWeatherProps) {
  if (loading) return <MainWeatherSkeleton />;

  if (!weather) {
    return (
      <div className="flex flex-col items-center gap-3 text-center text-muted">
        <span className="text-6xl" aria-hidden="true">🌍</span>
        <p className="text-xl font-light">Search for a city</p>
        <p className="text-sm">or allow location access for local weather</p>
      </div>
    );
  }

  const { current, city, daily } = weather;
  const condition = WEATHER_CODES[current.weather_code];
  const todayDaily = daily.find((d) => d.date === todayDateString());

  const temp = convertTemp(current.temperature, unit);
  const tempFormatted = formatTemperature(current.temperature, unit);
  const feelsLike = formatTemperature(current.feels_like, unit);
  const wind = formatWindSpeed(current.wind_speed);
  const humidity = `${current.humidity}%`;
  const conditionLabel = condition?.label ?? "Unknown";
  const hi = todayDaily ? formatTemperature(todayDaily.temperature_max, unit) : null;
  const lo = todayDaily ? formatTemperature(todayDaily.temperature_min, unit) : null;

  return (
    <article
      aria-label={`${city}: ${tempFormatted}, ${conditionLabel}, feels like ${feelsLike}, humidity ${humidity}, wind ${wind}`}
      className="relative flex flex-col items-center gap-1 animate-fade-in-up"
    >
      <div aria-live="polite" className="sr-only">
        {city}: {tempFormatted}, {conditionLabel}
      </div>

      <h2 className="text-3xl font-light text-primary/80 md:text-4xl">
        {city}
      </h2>

      <div className="relative flex items-center gap-2">
        <p className="text-[8rem] font-extralight leading-none tracking-tighter text-white md:text-[10rem]">
          {temp}°
        </p>
        <WeatherIcon code={current.weather_code} isDay={current.is_day} size="lg" />
      </div>

      <p className="text-lg font-light text-white">
        {conditionLabel}
      </p>

      {hi && lo && (
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="flex items-center gap-0.5 text-muted" aria-label={`High ${hi}`}>
            <svg width="10" height="10" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M4 1.5v5M2 3.5l2-2 2 2" />
            </svg>
            {hi}
          </span>
          <span className="flex items-center gap-0.5 text-muted" aria-label={`Low ${lo}`}>
            <svg width="10" height="10" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <path d="M4 6.5v-5M2 4.5l2 2 2-2" />
            </svg>
            {lo}
          </span>
        </div>
      )}

      <div className="mt-2 flex items-center gap-5 text-sm text-muted">
        <span className="flex items-center gap-1.5" aria-label={`Feels like ${feelsLike}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 9a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" /><path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41" />
          </svg>
          {feelsLike}
        </span>
        <span className="flex items-center gap-1.5" aria-label={`Humidity ${humidity}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          </svg>
          {humidity}
        </span>
        <span className="flex items-center gap-1.5" aria-label={`Wind ${wind}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M17.7 7.7A2.5 2.5 0 1 1 19 12H2m7.6-7.4A2 2 0 1 1 11 8H2m8.6 11.4A2 2 0 1 0 12 16H2" />
          </svg>
          {wind}
        </span>
      </div>
    </article>
  );
}
