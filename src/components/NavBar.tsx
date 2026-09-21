import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/flyradar">Radar des vols</Link></li>
      </ul>
    </nav>
  );
}
