import { type FormEvent } from 'react';
import '../App.css';
import StatusMessage from '../components/StatusMessage';
import { useAppContext } from '../context/useAppContext';
import { formatPosition, useFlightFilters } from '../hooks/useFlightFilters';
import { useOpenSkyFlights } from '../hooks/useOpenSkyFlights';

function ThemeToggle() {
  const { theme, toggleTheme } = useAppContext();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="reset-button"
      style={{ float: 'right', marginBottom: '20px' }}
    >
      {isDark ? 'Passer en Mode Clair ☀️' : 'Passer en Mode Sombre 🌙'}
    </button>
  );
}

export default function FlyRadar() {
  const { flights, loading, error } = useOpenSkyFlights();
  const {
    plaqueSearch,
    setPlaqueSearch,
    countryFilter,
    setCountryFilter,
    positionSearch,
    setPositionSearch,
    speedOrder,
    setSpeedOrder,
    altitudeOrder,
    setAltitudeOrder,
    countries,
    filteredFlights,
    resetFilters,
  } = useFlightFilters(flights);

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <div className="container">
      <ThemeToggle />

      <h1>Suivi des Vols — OpenSky Network</h1>
      <form className="filters" aria-label="Filtres des aéronefs" onSubmit={handleFilterSubmit}>
        <label className="filter-field">
          <span>Pays</span>
          <select
            value={countryFilter}
            onChange={(event) => setCountryFilter(event.target.value)}
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
            onChange={(event) => setPlaqueSearch(event.target.value)}
            className="filter-control"
          />
        </label>

        <label className="filter-field">
          <span>Position</span>
          <input
            type="search"
            placeholder="Ex. 48.8 ou 2.3"
            value={positionSearch}
            onChange={(event) => setPositionSearch(event.target.value)}
            className="filter-control"
          />
        </label>

        <label className="filter-field">
          <span>
            Vitesse <small>(tri prioritaire)</small>
          </span>
          <select
            value={speedOrder}
            onChange={(event) => setSpeedOrder(event.target.value as typeof speedOrder)}
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
            onChange={(event) => setAltitudeOrder(event.target.value as typeof altitudeOrder)}
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
      </form>

      <p className="subtitle">
        {loading ? 'Connexion au radar OpenSky...' : `${filteredFlights.length} aéronefs trouvés`}
      </p>

      {loading && <StatusMessage>Chargement des données en cours...</StatusMessage>}
      {error && <StatusMessage variant="error">{error}</StatusMessage>}

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
              {filteredFlights.map((flight, index) => (
                <tr key={`${flight.plaque}-${index}`}>
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
