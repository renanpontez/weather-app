import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { GeocodingResult } from "@weather-app/shared";
import { searchCities } from "@/api/forecast";
import { queryKeys } from "@/api/queryKeys";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_MS } from "@/lib/constants";

export function useCitySearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, DEBOUNCE_MS);

  const {
    data: results = [],
    isLoading: loading,
    error: queryError,
  } = useQuery<GeocodingResult[]>({
    queryKey: queryKeys.cities(debouncedQuery),
    queryFn: () => searchCities(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 60 * 60 * 1000,
  });

  const error = queryError
    ? "Failed to search cities. Please try again."
    : null;

  const clear = () => {
    setQuery("");
  };

  return { query, setQuery, results, loading, error, clear };
}
