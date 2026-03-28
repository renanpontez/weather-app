import clsx from "clsx";
import type { DailyForecast as DayForecast, TemperatureUnit } from "@weather-app/shared";
import { formatTemperature, formatDay, todayDateString } from "@/lib/format";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { useScrollMask } from "@/hooks/useScrollMask";

interface WeekForecastProps {
  days: DayForecast[];
  unit: TemperatureUnit;
}

function isToday(dateString: string) {
  return dateString === todayDateString();
}

function HiLo({ hi, lo, unit }: { hi: number; lo: number; unit: TemperatureUnit }) {
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="flex items-center gap-0.5 text-white">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M4 1.5v5M2 3.5l2-2 2 2" />
        </svg>
        {formatTemperature(hi, unit)}
      </span>
      <span className="flex items-center gap-0.5 text-muted">
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
          <path d="M4 6.5v-5M2 4.5l2 2 2-2" />
        </svg>
        {formatTemperature(lo, unit)}
      </span>
    </div>
  );
}

export function WeekForecast({ days, unit }: WeekForecastProps) {
  const { scrollRef, maskImage, onScroll } = useScrollMask();

  // Skip yesterday (index 0), show today + 5 future days
  const visibleDays = days.slice(1, 7);

  if (visibleDays.length === 0) return null;

  return (
    <section aria-label="6-day forecast" className="w-full">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-white">
        6-day forecast
      </h3>

      {/* Desktop: grid */}
      <div className="hidden w-full md:grid md:grid-cols-6 md:gap-2" role="list">
        {visibleDays.map((day, i) => (
          <div
            key={day.date}
            role="listitem"
            className={clsx(
              "flex flex-col items-center gap-1.5 rounded-xl py-3 animate-fade-in-up",
              isToday(day.date) ? "bg-white/[0.06]" : "bg-transparent",
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <p className={clsx("text-xs font-medium", isToday(day.date) ? "text-primary" : "text-muted")}>
              {isToday(day.date) ? "Today" : formatDay(day.date)}
            </p>
            <WeatherIcon code={day.weather_code} isDay={true} size="sm" />
            <HiLo hi={day.temperature_max} lo={day.temperature_min} unit={unit} />
          </div>
        ))}
      </div>

      {/* Mobile: horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide md:hidden"
        role="list"
        onScroll={onScroll}
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        {visibleDays.map((day, i) => (
          <div
            key={day.date}
            role="listitem"
            className={clsx(
              "flex shrink-0 items-center gap-3 rounded-xl px-5 py-3 animate-fade-in-up",
              isToday(day.date) ? "bg-white/[0.06]" : "bg-transparent",
            )}
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="text-left">
              <p className={clsx("text-xs font-medium", isToday(day.date) ? "text-primary" : "text-muted")}>
                {isToday(day.date) ? "Today" : formatDay(day.date)}
              </p>
              <HiLo hi={day.temperature_max} lo={day.temperature_min} unit={unit} />
            </div>
            <WeatherIcon code={day.weather_code} isDay={true} size="sm" />
          </div>
        ))}
      </div>
    </section>
  );
}
