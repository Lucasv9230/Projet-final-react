import { useEffect, useState } from 'react';
import './App.css';

interface Flight {
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

function formatPosition(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return 'Inconnue';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(3)}° ${latDir}, ${Math.abs(lon).toFixed(3)}° ${lonDir}`;
}

function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [searchText, setSearchText] = useState("");

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
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredFlights = flights.filter(f =>
    f.plaque.toLowerCase().startsWith(searchText.toLowerCase())
  );

  return (
    <div className="container">

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Tape une lettre pour filtrer les modèles..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        className="search-input"
      />

      <h1>Suivi des Vols — OpenSky Network</h1>
      <p className="subtitle">
        {loading
          ? 'Connexion au radar OpenSky...'
          : `${filteredFlights.length} aéronefs trouvés`}
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
                <th>Position (Lat, Lon)</th>
                <th>Vitesse</th>
                <th>Altitude</th>
              </tr>
            </thead>
            <tbody>
              {filteredFlights.map((flight, idx) => (
                <tr key={`${flight.plaque}-${idx}`}>
                  <td className="font-bold">{flight.plaque}</td>
                  <td>{flight.pays}</td>
                  <td className="position-cell">
                    {formatPosition(flight.latitude, flight.longitude)}
                  </td>
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
