import { useRef, useState, useCallback } from "react";
import clsx from "clsx";
import type { GeocodingResult } from "@weather-app/shared";
import { useCitySearch } from "@/hooks/useCitySearch";

interface SearchBarProps {
  onCityPick: (city: GeocodingResult) => void;
}

export function SearchBar({ onCityPick }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const { query, setQuery, results, loading, error, clear } = useCitySearch();

  const confirmSelection = useCallback(
    (city: GeocodingResult) => {
      onCityPick(city);
      clear();
      setDropdownVisible(false);
      setHighlighted(-1);
      inputRef.current?.blur();
    },
    [onCityPick, clear],
  );

  const dismissDropdown = useCallback(() => {
    setDropdownVisible(false);
    setHighlighted(-1);
    inputRef.current?.blur();
  }, []);

  const onInputChange = useCallback(
    (value: string) => {
      setQuery(value);
      setDropdownVisible(true);
      setHighlighted(-1);
    },
    [setQuery],
  );

  const onKeyNavigation = useCallback(
    (e: React.KeyboardEvent) => {
      if (!dropdownVisible || results.length === 0) return;

      const handlers: Record<string, () => void> = {
        ArrowDown: () => setHighlighted((h) => Math.min(h + 1, results.length - 1)),
        ArrowUp: () => setHighlighted((h) => Math.max(h - 1, 0)),
        Enter: () => highlighted >= 0 && results[highlighted] && confirmSelection(results[highlighted]),
        Escape: dismissDropdown,
      };

      const handler = handlers[e.key];
      if (handler) {
        e.preventDefault();
        handler();
      }
    },
    [dropdownVisible, results, highlighted, confirmSelection, dismissDropdown],
  );

  const showSkeleton = dropdownVisible && loading && query.length >= 2;
  const showResults = dropdownVisible && !loading && results.length > 0;
  const showError = dropdownVisible && error;
  const showEmpty = dropdownVisible && !loading && !error && query.length >= 2 && results.length === 0;

  return (
    <div className="relative w-full">
      <label htmlFor="city-lookup" className="sr-only">
        Search for a city
      </label>
      <div className="relative">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
          <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          id="city-lookup"
          type="text"
          role="combobox"
          aria-expanded={dropdownVisible}
          aria-haspopup="listbox"
          value={query}
          onChange={(e) => onInputChange(e.target.value)}
          onFocus={() => results.length > 0 && setDropdownVisible(true)}
          onBlur={dismissDropdown}
          onKeyDown={onKeyNavigation}
          placeholder="Search for a city..."
          autoComplete="off"
          aria-autocomplete="list"
          aria-controls={showResults ? "city-suggestions" : undefined}
          aria-activedescendant={showResults && highlighted >= 0 ? `suggestion-${highlighted}` : undefined}
          className="w-full rounded-full border border-white/10 bg-surface py-2.5 pl-10 pr-4 text-base md:text-sm text-white placeholder:text-muted focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />

        {loading && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2" aria-hidden="true">
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted border-t-primary" />
          </div>
        )}
      </div>

      {showSkeleton && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-white/10 bg-surface p-3 shadow-xl">
          <div className="space-y-2.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-5 w-full animate-pulse rounded bg-white/10" />
            ))}
          </div>
        </div>
      )}

      {showResults && (
        <ul
          id="city-suggestions"
          role="listbox"
          aria-label="City suggestions"
          className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-2xl border border-white/10 bg-surface shadow-xl"
        >
          {results.map((city, i) => (
            <li
              key={city.id}
              id={`suggestion-${i}`}
              role="option"
              aria-selected={i === highlighted}
              className={clsx(
                "cursor-pointer px-4 py-2.5 text-sm transition-colors first:rounded-t-2xl last:rounded-b-2xl",
                i === highlighted ? "bg-primary/15 text-primary" : "text-white/80 hover:bg-surface-hover",
              )}
              onMouseDown={(e) => {
                e.preventDefault();
                confirmSelection(city);
              }}
              onMouseEnter={() => setHighlighted(i)}
            >
              <span className="font-medium">{city.name}</span>
              {city.admin1 && <span className="text-muted">, {city.admin1}</span>}
              <span className="text-muted"> — {city.country}</span>
            </li>
          ))}
        </ul>
      )}

      {showError && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-400 shadow-xl" role="alert">
          {error}
        </div>
      )}

      {showEmpty && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-white/10 bg-surface px-4 py-2.5 text-center text-sm text-muted shadow-xl">
          No cities found for &ldquo;{query}&rdquo;
        </div>
      )}
    </div>
  );
}
