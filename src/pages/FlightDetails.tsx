import { Link, useParams } from 'react-router-dom';

export default function FlightDetails() {
  const { icao } = useParams<{ icao: string }>();

  return (
    <main className="container">
      <h1>Détail de l'aéronef</h1>
      <p className="subtitle">Identifiant ICAO : {icao?.toUpperCase() ?? 'Inconnu'}</p>
      <Link className="hero-button" to="/flyradar">Retour au radar</Link>
    </main>
  );
}
