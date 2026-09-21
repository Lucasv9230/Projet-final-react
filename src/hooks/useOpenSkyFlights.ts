import { useEffect, useState } from 'react';

export interface Flight {
  plaque: string;
  pays: string;
  latitude: number | null;
  longitude: number | null;
  vitesse: number | null;
  altitude: number | null;
}

type OpenSkyState = (string | number | boolean | null | undefined)[];

interface OpenSkyApiResponse {
  time: number;
  states: OpenSkyState[] | null;
}

export function useOpenSkyFlights(): {
  flights: Flight[];
  loading: boolean;
  error: string | null;
} {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const targetUrl = '/api/opensky?lamin=42.0&lomin=-4.5&lamax=51.0&lomax=8.5';
    const controller = new AbortController();

    fetch(targetUrl, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erreur HTTP OpenSky : ${res.status}`);
        }
        return res.json() as Promise<OpenSkyApiResponse>;
      })
      .then((data) => {
        if (!data.states) {
          setFlights([]);
          return;
        }

        const formatted: Flight[] = data.states.map((state) => {
          const rawCallsign = typeof state[1] === 'string' ? state[1].trim() : '';
          const icao = typeof state[0] === 'string' ? state[0] : '';
          const country = typeof state[2] === 'string' ? state[2] : 'Inconnu';
          const lon = typeof state[5] === 'number' ? state[5] : null;
          const lat = typeof state[6] === 'number' ? state[6] : null;
          const baroAlt = typeof state[7] === 'number' ? state[7] : null;
          const velocityMs = typeof state[9] === 'number' ? state[9] : null;

          return {
            plaque: (rawCallsign || icao || 'INCONNU').toUpperCase(),
            pays: country,
            latitude: lat,
            longitude: lon,
            vitesse: velocityMs !== null ? Math.round(velocityMs * 3.6) : null,
            altitude: baroAlt !== null ? Math.round(baroAlt) : null,
          };
        });

        setFlights(formatted);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === 'AbortError') return;
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => controller.abort();
  }, []);

  return { flights, loading, error };
}
