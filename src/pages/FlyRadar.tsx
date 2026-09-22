import { type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import Panel from '../components/Panel';
import StatusMessage from '../components/StatusMessage';
import { useAppContext } from '../context/useAppContext';
import { formatPosition, useFlightFilters } from '../hooks/useFlightFilters';
import { useOpenSkyFlights } from '../hooks/useOpenSkyFlights';

interface FilterErrors {
  plaque?: string;
  position?: string;
}

function validateFilters(plaque: string, position: string): FilterErrors {
  const errors: FilterErrors = {};

  if (plaque && !/^[a-z0-9 -]+$/i.test(plaque)) {
    errors.plaque = 'La plaque ne peut contenir que des lettres, chiffres, espaces ou tirets.';
  }

  if (position && !/^[+-]?\d+(?:\.\d+)?(?:\s*,\s*[+-]?\d+(?:\.\d+)?)?$/.test(position.trim())) {
    errors.position = 'Saisissez une coordonnée numérique, par exemple 48.8 ou 48.8, 2.3.';
  }

  return errors;
}

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
  const filterErrors = validateFilters(plaqueSearch, positionSearch);
  const hasFilterErrors = Object.values(filterErrors).some(Boolean);

  const handleFilterSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (hasFilterErrors) return;
  };

  return (
    <Panel className="container">
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
            aria-describedby={filterErrors.plaque ? 'plaque-error' : undefined}
            aria-invalid={Boolean(filterErrors.plaque)}
            type="search"
            placeholder="Ex. AFR..."
            value={plaqueSearch}
            onChange={(event) => setPlaqueSearch(event.target.value)}
            className="filter-control"
          />
          {filterErrors.plaque && <span id="plaque-error" className="field-error" role="alert">{filterErrors.plaque}</span>}
        </label>

        <label className="filter-field">
          <span>Position</span>
          <input
            aria-describedby={filterErrors.position ? 'position-error' : undefined}
            aria-invalid={Boolean(filterErrors.position)}
            type="search"
            placeholder="Ex. 48.8 ou 2.3"
            value={positionSearch}
            onChange={(event) => setPositionSearch(event.target.value)}
            className="filter-control"
          />
          {filterErrors.position && <span id="position-error" className="field-error" role="alert">{filterErrors.position}</span>}
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

        <div className="filter-actions">
          <button type="submit" className="reset-button" disabled={hasFilterErrors}>
            Appliquer les filtres
          </button>
          <button type="button" className="reset-button secondary-button" onClick={resetFilters}>
            Réinitialiser
          </button>
        </div>
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
                  <td className="font-bold">
                    <Link to={`/flight/${encodeURIComponent(flight.plaque)}`}>{flight.plaque}</Link>
                  </td>
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
    </Panel>
  );
}
