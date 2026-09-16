import { useEffect, useState } from 'react';
import './App.css';

interface Flight {
  plaque: string;
  pays: string;
  modele: string;
  vitesse: number | null;
  altitude: number | null;
}

type OpenSkyState = (string | number | boolean | null | undefined)[];

interface OpenSkyApiResponse {
  time: number;
  states: OpenSkyState[] | null;
}

function getModele(category?: number): string {
  switch (category) {
    case 2:
      return 'Avion léger (< 7t)';
    case 3:
      return 'Moyen porteur (A320, B737)';
    case 4:
      return 'Gros porteur (A350, B777)';
    case 5:
      return 'Très gros porteur (A380, B747)';
    case 6:
      return 'Haute performance (Chasseur)';
    case 7:
      return 'Hélicoptère';
    default:
      return 'Avion de ligne standard';
  }
}

function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const targetUrl = '/api/opensky?lamin=42.0&lomin=-4.5&lamax=51.0&lomax=8.5';

    fetch(targetUrl)
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
          const baroAlt = typeof state[7] === 'number' ? state[7] : null;
          const velocityMs = typeof state[9] === 'number' ? state[9] : null;
          const cat = typeof state[17] === 'number' ? state[17] : undefined;

          return {
            plaque: (rawCallsign || icao || 'INCONNU').toUpperCase(),
            pays: country,
            modele: getModele(cat),
            vitesse: velocityMs !== null ? Math.round(velocityMs * 3.6) : null,
            altitude: baroAlt !== null ? Math.round(baroAlt) : null,
          };
        });

        setFlights(formatted);
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1>Suivi des Vols — OpenSky Network</h1>
      <p className="subtitle">
        {loading ? 'Connexion au radar OpenSky...' : `${flights.length} aéronefs détectés`}
      </p>

      {loading && <div className="status-message">Chargement des données en cours...</div>}
      {error && <div className="status-message error">{error}</div>}

      {!loading && !error && (
        <div className="table-wrapper">
          <table className="flight-table">
            <thead>
              <tr>
                <th>Plaque</th>
                <th>Pays</th>
                <th>Modèle</th>
                <th>Vitesse</th>
                <th>Altitude</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight, idx) => (
                <tr key={`${flight.plaque}-${idx}`}>
                  <td className="font-bold">{flight.plaque}</td>
                  <td>{flight.pays}</td>
                  <td>{flight.modele}</td>
                  <td>{flight.vitesse !== null ? `${flight.vitesse} km/h` : 'N/A'}</td>
                  <td>{flight.altitude !== null ? `${flight.altitude.toLocaleString()} m` : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;
