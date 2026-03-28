import { useState, useEffect } from "react";
import { getGeoLocation } from "@/api/forecast";
import { DEFAULT_CITY } from "@/lib/constants";

interface GeoState {
  latitude: number;
  longitude: number;
  city: string | null;
  source: "navigator" | "ip" | "default";
  loading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [geo, setGeo] = useState<GeoState>({
    latitude: DEFAULT_CITY.latitude,
    longitude: DEFAULT_CITY.longitude,
    city: null,
    source: "default",
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    async function resolve() {
      // Try browser geolocation first
      try {
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              maximumAge: 300_000,
            });
          }
        );

        if (cancelled) return;
        setGeo({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          city: null,
          source: "navigator",
          loading: false,
          error: null,
        });
        return;
      } catch {
        // Fall through to IP-based
      }

      // Try IP-based via Cloudflare cf headers
      try {
        const ipGeo = await getGeoLocation();
        if (cancelled) return;

        if (ipGeo.latitude && ipGeo.longitude) {
          setGeo({
            latitude: ipGeo.latitude,
            longitude: ipGeo.longitude,
            city: ipGeo.city,
            source: "ip",
            loading: false,
            error: null,
          });
          return;
        }
      } catch {
        // Fall through to default
      }

      // Default fallback
      if (!cancelled) {
        setGeo({
          latitude: DEFAULT_CITY.latitude,
          longitude: DEFAULT_CITY.longitude,
          city: DEFAULT_CITY.name,
          source: "default",
          loading: false,
          error: "Could not determine location. Showing default city.",
        });
      }
    }

    resolve();
    return () => {
      cancelled = true;
    };
  }, []);

  return geo;
}
