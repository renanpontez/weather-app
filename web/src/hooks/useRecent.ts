import { useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import type { RecentSearch, RecentSearchInput } from "@weather-app/shared";
import {
  getRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
} from "@/api/history";
import { queryKeys } from "@/api/queryKeys";
import { API_BASE_URL } from "@/lib/constants";

function useLiveSync(invalidate: () => void) {
  const socketRef = useRef<WebSocket | null>(null);
  const retriesRef = useRef(0);
  const closedRef = useRef(false);
  const invalidateRef = useRef(invalidate);
  invalidateRef.current = invalidate;

  useEffect(() => {
    closedRef.current = false;
    retriesRef.current = 0;

    function open() {
      if (closedRef.current || retriesRef.current >= 5) return;

      const proto = location.protocol === "https:" ? "wss:" : "ws:";
      const host = API_BASE_URL ? new URL(API_BASE_URL).host : location.host;
      const socket = new WebSocket(`${proto}//${host}/api/recent/ws`);

      socket.onopen = () => {
        retriesRef.current = 0;
      };

      socket.onmessage = () => {
        invalidateRef.current();
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (closedRef.current) return;
        const delay = Math.min(1000 * 2 ** retriesRef.current, 30_000);
        retriesRef.current++;
        setTimeout(open, delay);
      };

      socket.onerror = () => socket.close();
      socketRef.current = socket;
    }

    open();

    return () => {
      closedRef.current = true;
      socketRef.current?.close();
      socketRef.current = null;
    };
  }, []);
}

export function useRecent() {
  const queryClient = useQueryClient();

  const { data: searches = [], isLoading: loading } = useQuery<RecentSearch[]>({
    queryKey: queryKeys.recent(),
    queryFn: getRecentSearches,
    staleTime: 30_000,
  });

  const invalidateRecent = useCallback(
    () => queryClient.invalidateQueries({ queryKey: queryKeys.recent() }),
    [queryClient],
  );

  useLiveSync(invalidateRecent);

  const trackMutation = useMutation({
    mutationFn: addRecentSearch,
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.recent(), updated);
    },
  });

  const removeMutation = useMutation({
    mutationFn: (search: RecentSearch) => removeRecentSearch(search.city, search.country),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.recent(), updated);
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearRecentSearches,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.recent(), []);
    },
  });

  return {
    searches,
    loading,
    trackSearch: trackMutation.mutate,
    remove: removeMutation.mutate,
    clearAll: clearMutation.mutate,
  };
}
