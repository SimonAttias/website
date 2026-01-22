import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Bienvenue chez Neastoria</h1>
          <p className="hero-subtitle">
            Un club d'histoire passionné dédié à l'exploration et au partage des grands récits
            du passé à travers des conférences, des événements et des rencontres enrichissantes.
          </p>
          <div className="hero-buttons">
            <Link to="/events" className="btn btn-primary">
              Découvrir nos événements
            </Link>
            <Link to="/membership" className="btn btn-secondary">
              Rejoindre le club
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-container">
          <div className="feature">
            <h3>Conférences</h3>
            <p>
              Des intervenants passionnants et des chercheurs renommés partagent leurs
              connaissances sur des périodes historiques fascinantes.
            </p>
          </div>
          <div className="feature">
            <h3>Événements</h3>
            <p>
              Participez à nos événements culturels, visites guidées et discussions
              thématiques autour de l'histoire.
            </p>
          </div>
          <div className="feature">
            <h3>Communauté</h3>
            <p>
              Rejoignez une communauté de passionnés d'histoire et échangez avec
              des personnes partageant les mêmes intérêts.
            </p>
          </div>
        </div>
      </section>

      <section className="upcoming-events">
        <div className="section-content">
          <h2>Prochains événements</h2>
          <p className="section-intro">
            Ne manquez pas nos prochaines conférences et rencontres
          </p>
          <div className="events-preview">
            <div className="event-card">
              <div className="event-date">
                <span className="day">15</span>
                <span className="month">FÉV</span>
              </div>
              <div className="event-info">
                <h3>La Renaissance italienne</h3>
                <p>Conférence avec Dr. Marie Dubois</p>
                <Link to="/events" className="event-link">En savoir plus →</Link>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date">
                <span className="day">22</span>
                <span className="month">FÉV</span>
              </div>
              <div className="event-info">
                <h3>Les grandes découvertes</h3>
                <p>Discussion thématique</p>
                <Link to="/events" className="event-link">En savoir plus →</Link>
              </div>
            </div>
          </div>
          <Link to="/events" className="view-all">
            Voir tous les événements
          </Link>
        </div>
      </section>

      <section className="cta">
        <div className="cta-content">
          <h2>Rejoignez-nous</h2>
          <p>
            Devenez membre de Neastoria pour seulement 20€ par an et bénéficiez d'un accès
            privilégié à tous nos événements et contenus exclusifs.
          </p>
          <Link to="/membership" className="btn btn-primary">
            Devenir membre
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
