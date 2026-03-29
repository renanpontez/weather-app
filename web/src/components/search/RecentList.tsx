import clsx from "clsx";
import type { RecentSearch, TemperatureUnit } from "@weather-app/shared";
import { formatTemperature, timeAgo } from "@/lib/format";
import { WeatherIcon } from "@/components/weather/WeatherIcon";
import { Skeleton } from "@/components/common/Skeleton";

interface RecentListProps {
  searches: RecentSearch[];
  unit: TemperatureUnit;
  loading: boolean;
  activeCity?: string;
  onSelect: (search: RecentSearch) => void;
  onRemove: (search: RecentSearch) => void;
  onClearAll: () => void;
}

export function RecentList({ searches, unit, loading, activeCity, onSelect, onRemove, onClearAll }: RecentListProps) {
  if (loading) {
    return (
      <div>
        <h3 className="mb-3 text-xs font-medium uppercase tracking-widest text-white">Recent searches</h3>
        <div className="flex gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-44 shrink-0 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (searches.length === 0) return null;

  return (
    <section aria-label="Recently searched cities">
      <div className="mb-3 flex items-baseline justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-medium uppercase tracking-widest text-white">
            Recent searches
          </h3>
          <span className="text-[10px] text-muted">{searches.length}/10</span>
        </div>
        <button
          onClick={onClearAll}
          className="cursor-pointer rounded text-[10px] text-muted transition-colors hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-primary/20"
          aria-label="Clear all recent searches"
        >
          Clear all
        </button>
      </div>
      <ul
        className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide list-none m-0 p-0"
      >
        {searches.map((search, i) => {
          const isActive = search.city === activeCity;
          return (
            <li key={`${search.city}-${search.country}`} className="shrink-0">
            <button
              type="button"
              aria-label={`Select ${search.city}, ${search.country}`}
              className={clsx(
                "group relative flex shrink-0 cursor-pointer items-center gap-8 rounded-xl border px-5 py-3 text-left transition-all animate-fade-in-up",
                "hover:border-primary/20 hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary/20",
                isActive
                  ? "border-primary/30 bg-primary/5"
                  : "border-white/10 bg-surface-light",
              )}
              style={{ animationDelay: `${i * 50}ms` }}
              onClick={() => onSelect(search)}
            >
              <span
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(search);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.stopPropagation();
                    e.preventDefault();
                    onRemove(search);
                  }
                }}
                aria-label={`Remove ${search.city}`}
                className="absolute -right-1.5 -top-1.5 flex h-5 w-5 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-surface text-muted opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
                  <path d="M2 2l6 6M8 2l-6 6" />
                </svg>
              </span>
              <div className="text-left">
                <p className="font-medium text-white">{search.city}</p>
                <p className="text-md text-muted">
                  {formatTemperature(search.temperature, unit)}
                </p>
                <p className="text-[10px] text-muted mt-2">
                  {timeAgo(search.searched_at)}
                </p>
              </div>
              <WeatherIcon code={search.weather_code} isDay={true} size="sm" />
            </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
