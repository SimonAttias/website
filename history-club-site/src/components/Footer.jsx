import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>Neastoria</h3>
          <p>Club d'histoire passionné organisant des conférences et événements culturels.</p>
        </div>
        <div className="footer-section">
          <h4>Navigation</h4>
          <ul>
            <li><a href="/">Accueil</a></li>
            <li><a href="/events">Événements</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/about">Le Club</a></li>
            <li><a href="/membership">Nous rejoindre</a></li>
          </ul>
        </div>
        <div className="footer-section">
          <h4>Contact</h4>
          <ul>
            <li><a href="mailto:contact@neastoria.fr">Email</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
            <li><a href="https://youtube.com" target="_blank" rel="noopener noreferrer">YouTube</a></li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Neastoria. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

export default Footer;
