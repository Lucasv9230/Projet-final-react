import { ArrowRight, Gauge, Radar, SlidersHorizontal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow"><span className="pulse-dot" /> OPEN SKY NETWORK</p>
          <h1>Le ciel, <em>en mouvement.</em></h1>
          <p className="hero-description">
            Explore les aéronefs qui traversent l’Europe et transforme les données de vol en une lecture claire, instantanée.
          </p>
          <Link className="hero-button" to="/flyradar">
            Ouvrir le radar <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>

        <div className="radar-visual" aria-hidden="true">
          <div className="radar-sweep" />
          <div className="radar-ring radar-ring-large" />
          <div className="radar-ring radar-ring-medium" />
          <div className="radar-ring radar-ring-small" />
          <span className="radar-blip blip-one" />
          <span className="radar-blip blip-two" />
          <span className="radar-blip blip-three" />
          <Radar className="radar-icon" size={34} strokeWidth={1.4} />
        </div>
      </section>

      <section className="home-features" aria-label="Fonctionnalités principales">
        <article className="feature-card feature-card-accent">
          <div className="feature-icon"><Gauge size={21} /></div>
          <div><h2>Données en direct</h2><p>Une vue actuelle du trafic aérien européen.</p></div>
        </article>
        <article className="feature-card">
          <div className="feature-icon"><Radar size={21} /></div>
          <div><h2>Lecture précise</h2><p>Position, vitesse et altitude réunies au même endroit.</p></div>
        </article>
        <article className="feature-card">
          <div className="feature-icon"><SlidersHorizontal size={21} /></div>
          <div><h2>Filtres avancés</h2><p>Affiche exactement les vols que tu recherches.</p></div>
        </article>
      </section>
    </div>
  );
}
