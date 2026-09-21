import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <div className="not-found-orbit" aria-hidden="true">
        <span className="not-found-dot dot-one" />
        <span className="not-found-dot dot-two" />
        <span className="not-found-dot dot-three" />
        <span className="not-found-center" />
      </div>
      <div className="not-found-content">
        <p className="not-found-eyebrow">SIGNAL PERDU</p>
        <h1>404</h1>
        <p>Cette trajectoire n'existe pas dans notre radar.</p>
        <button type="button" className="not-found-button" onClick={() => navigate('/')}>
          Retour à l'accueil
        </button>
      </div>
    </main>
  );
}
