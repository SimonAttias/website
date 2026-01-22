import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>Neastoria</h1>
        </Link>
        <nav className="nav">
          <Link to="/" className="nav-link">Accueil</Link>
          <Link to="/events" className="nav-link">Événements</Link>
          <Link to="/blog" className="nav-link">Blog</Link>
          <Link to="/about" className="nav-link">Le Club</Link>
          <Link to="/membership" className="nav-link">Nous rejoindre</Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;
