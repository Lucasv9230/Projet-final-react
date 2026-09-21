import { useEffect, useState } from 'react';
import '../App.css';

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

type SortOrder = 'none' | 'ascending' | 'descending';

function formatPosition(lat: number | null, lon: number | null): string {
  if (lat === null || lon === null) return 'Inconnue';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'O';
  return `${Math.abs(lat).toFixed(3)}° ${latDir}, ${Math.abs(lon).toFixed(3)}° ${lonDir}`;
}

function compareNullableNumbers(
  firstValue: number | null,
  secondValue: number | null,
  order: SortOrder,
): number {
  if (firstValue === null && secondValue === null) return 0;
  if (firstValue === null) return 1;
  if (secondValue === null) return -1;

  return order === 'ascending' ? firstValue - secondValue : secondValue - firstValue;
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="reset-button"
      style={{ float: 'right', marginBottom: '20px' }}
    >
      {isDark ? 'Passer en Mode Clair ☀️' : 'Passer en Mode Sombre 🌙'}
    </button>
  );
}

export default function FlyRadar() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [plaqueSearch, setPlaqueSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('');
  const [positionSearch, setPositionSearch] = useState('');
  const [speedOrder, setSpeedOrder] = useState<SortOrder>('none');
  const [altitudeOrder, setAltitudeOrder] = useState<SortOrder>('none');

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

  const countries = Array.from(new Set(flights.map((flight) => flight.pays)))
    .filter((country) => country !== 'Inconnu')
    .sort((firstCountry, secondCountry) => firstCountry.localeCompare(secondCountry));

  const normalizedPlaqueSearch = plaqueSearch.trim().toLowerCase();
  const normalizedPositionSearch = positionSearch.trim().toLowerCase();

  const filteredFlights = flights
    .filter((flight) => {
      const formattedPosition = formatPosition(flight.latitude, flight.longitude).toLowerCase();
      const coordinates = `${flight.latitude ?? ''}, ${flight.longitude ?? ''}`.toLowerCase();

      return (
        (!countryFilter || flight.pays === countryFilter) &&
        (!normalizedPlaqueSearch || flight.plaque.toLowerCase().includes(normalizedPlaqueSearch)) &&
        (!normalizedPositionSearch ||
          formattedPosition.includes(normalizedPositionSearch) ||
          coordinates.includes(normalizedPositionSearch))
      );
    })
    .sort((firstFlight, secondFlight) => {
      if (speedOrder !== 'none') {
        const speedComparison = compareNullableNumbers(firstFlight.vitesse, secondFlight.vitesse, speedOrder);
        if (speedComparison !== 0) return speedComparison;
      }

      if (altitudeOrder !== 'none') {
        return compareNullableNumbers(firstFlight.altitude, secondFlight.altitude, altitudeOrder);
      }

      return firstFlight.pays.localeCompare(secondFlight.pays);
    });

  const resetFilters = () => {
    setPlaqueSearch('');
    setCountryFilter('');
    setPositionSearch('');
    setSpeedOrder('none');
    setAltitudeOrder('none');
  };

  return (
    <div className="container">
      <ThemeToggle />

      <h1>Suivi des Vols — OpenSky Network</h1>
      <div className="filters" aria-label="Filtres des aéronefs">
        <label className="filter-field">
          <span>Pays</span>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="filter-control"
          >
            <option value="">Tous les pays</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label className="filter-field">
          <span>Plaque</span>
          <input
            type="search"
            placeholder="Ex. AFR..."
            value={plaqueSearch}
            onChange={(e) => setPlaqueSearch(e.target.value)}
            className="filter-control"
          />
        </label>

        <label className="filter-field">
          <span>Position</span>
          <input
            type="search"
            placeholder="Ex. 48.8 ou 2.3"
            value={positionSearch}
            onChange={(e) => setPositionSearch(e.target.value)}
            className="filter-control"
          />
        </label>

        <label className="filter-field">
          <span>
            Vitesse <small>(tri prioritaire)</small>
          </span>
          <select
            value={speedOrder}
            onChange={(e) => setSpeedOrder(e.target.value as SortOrder)}
            className="filter-control"
          >
            <option value="none">Ordre par défaut</option>
            <option value="ascending">Priorité : du plus lent au plus rapide</option>
            <option value="descending">Priorité : du plus rapide au plus lent</option>
          </select>
        </label>

        <label className="filter-field">
          <span>
            Altitude <small>(tri prioritaire)</small>
          </span>
          <select
            value={altitudeOrder}
            onChange={(e) => setAltitudeOrder(e.target.value as SortOrder)}
            className="filter-control"
          >
            <option value="none">Ordre par défaut</option>
            <option value="ascending">Priorité : de la plus basse à la plus haute</option>
            <option value="descending">Priorité : de la plus haute à la plus basse</option>
          </select>
        </label>

        <p className="sort-note">
          Sans tri vitesse ou altitude, les pays sont classés alphabétiquement. Un tri numérique devient prioritaire.
        </p>

        <button type="button" className="reset-button" onClick={resetFilters}>
          Réinitialiser
        </button>
      </div>

      <p className="subtitle">
        {loading ? 'Connexion au radar OpenSky...' : `${filteredFlights.length} aéronefs trouvés`}
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
                  <td>
                    {flight.altitude !== null ? `${flight.altitude.toLocaleString()} m` : 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredFlights.length === 0 && (
            <p className="empty-message">Aucun aéronef ne correspond à ces filtres.</p>
          )}
        </div>
      )}
    </div>
  );
}