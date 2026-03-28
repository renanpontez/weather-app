import { useEffect, useCallback, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  }, []); // stable — no dependency on invalidate to avoid reconnect loops
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

  const trackSearch = useCallback(
    async (input: RecentSearchInput) => {
      try {
        const updated = await addRecentSearch(input);
        queryClient.setQueryData(queryKeys.recent(), updated);
      } catch (err) {
        console.warn("Failed to track search:", err);
      }
    },
    [queryClient],
  );

  const remove = useCallback(
    async (search: RecentSearch) => {
      try {
        const updated = await removeRecentSearch(search.city, search.country);
        queryClient.setQueryData(queryKeys.recent(), updated);
      } catch (err) {
        console.warn("Recent search operation failed:", err);
      }
    },
    [queryClient],
  );

  const clearAll = useCallback(async () => {
    try {
      await clearRecentSearches();
      queryClient.setQueryData(queryKeys.recent(), []);
    } catch (err) {
      console.warn("Recent search operation failed:", err);
    }
  }, [queryClient]);

  return { searches, loading, trackSearch, remove, clearAll };
}
