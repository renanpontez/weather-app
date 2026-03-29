import { useRef } from "react";
import type { GeocodingResult, RecentSearch } from "@weather-app/shared";
import { useInitialWeather } from "@/hooks/useInitialWeather";
import { useUnitsPreference } from "@/hooks/useUnitsPreference";
import { useRecent } from "@/hooks/useRecent";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { SearchBar } from "@/components/SearchBar/SearchBar";
import { MainWeather } from "@/components/MainWeather/MainWeather";
import { RecentList } from "@/components/RecentList/RecentList";
import { Alert } from "@/components/common/Alert";
import { UnitToggle } from "@/components/common/UnitToggle";
import { WeekForecast } from "@/components/WeekForecast/WeekForecast";
import { WeekForecastSkeleton } from "@/components/WeekForecast/WeekForecastSkeleton";
import { WeatherBackground } from "@/components/common/WeatherBackground";
interface LocationFields {
  city: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
}

export function App() {
  const weatherRef = useRef<HTMLDivElement>(null);
  const isOnline = useOnlineStatus();
  const { unit, toggle } = useUnitsPreference();
  const { weather, isLoading, error, geoError, refetch, selectLocation } = useInitialWeather();
  const { searches, loading: recentLoading, trackSearch, remove, clearAll } = useRecent();

  function handleLocationSelect(loc: LocationFields) {
    trackSearch(loc);
    selectLocation(
      {
        lat: loc.latitude,
        lon: loc.longitude,
        city: loc.city,
        country: loc.country,
        countryCode: loc.country_code,
      },
      unit,
    );
    weatherRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  const errorText = error instanceof Error ? error.message : error ? String(error) : null;

  return (
    <div className="relative min-h-screen text-white">
      <WeatherBackground
        weatherCode={weather?.current.weather_code ?? 0}
        isDay={weather?.current.is_day ?? true}
      />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to main content
      </a>

      {!isOnline && (
        <div role="alert" className="bg-yellow-600/90 px-4 py-2 text-center text-sm text-white">
          You are offline — showing cached data
        </div>
      )}

      <div className="mx-auto max-w-5xl px-6 py-8 md:px-12">
        <header className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-light tracking-wide text-primary md:text-4xl">
              WeatherApp
            </h1>
            <div className="flex items-center gap-2 md:hidden">
              <UnitToggle unit={unit} onToggle={toggle} />
            </div>
          </div>
          <div className="flex items-center gap-2 md:max-w-md md:ml-auto md:-mt-12">
            <div className="flex-1">
              <SearchBar
                onCityPick={(city: GeocodingResult) =>
                  handleLocationSelect({
                    city: city.name,
                    country: city.country,
                    country_code: city.country_code,
                    latitude: city.latitude,
                    longitude: city.longitude,
                  })
                }
              />
            </div>
            <div className="hidden md:block">
              <UnitToggle unit={unit} onToggle={toggle} />
            </div>
          </div>
        </header>

        <main id="main-content">
          {errorText && (
            <div className="mx-auto mt-6 max-w-md">
              <Alert message={errorText} onRetry={() => refetch()} />
            </div>
          )}

          {geoError && !weather && (
            <div className="mx-auto mt-6 max-w-md">
              <Alert message={geoError} />
            </div>
          )}

          <div ref={weatherRef} className="flex min-h-[40vh] items-center justify-center py-18">
            <MainWeather weather={weather} unit={unit} loading={isLoading} />
          </div>

          <div className="flex flex-col gap-10">
            {weather ? (
              <WeekForecast days={weather.daily} unit={unit} />
            ) : isLoading ? (
              <WeekForecastSkeleton />
            ) : null}

            <RecentList
              searches={searches}
              unit={unit}
              loading={recentLoading}
              activeCity={weather?.city}
              onSelect={(search: RecentSearch) => handleLocationSelect(search)}
              onRemove={remove}
              onClearAll={clearAll}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
