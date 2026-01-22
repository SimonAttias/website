import './About.css';

function About() {
  return (
    <div className="about-page">
      <section className="page-header">
        <h1>Le Club</h1>
        <p>Qui sommes-nous et quelle est notre mission</p>
      </section>

      <section className="about-section">
        <div className="about-container">
          <div className="about-content">
            <h2>Notre Histoire</h2>
            <p>
              Neastoria est né de la passion d'un groupe d'amateurs d'histoire désireux de
              partager leur amour du passé avec un public plus large. Fondé en 2020, notre club
              s'est rapidement développé pour devenir une référence dans l'organisation
              d'événements culturels et historiques de qualité.
            </p>
            <p>
              Nous croyons que l'histoire n'est pas simplement une succession de dates et
              d'événements, mais un moyen de comprendre notre présent et d'imaginer notre avenir.
              À travers nos conférences, discussions et activités, nous cherchons à rendre
              l'histoire accessible, passionnante et pertinente pour tous.
            </p>
          </div>

          <div className="mission-section">
            <h2>Notre Mission</h2>
            <div className="mission-grid">
              <div className="mission-card">
                <h3>Partager</h3>
                <p>
                  Diffuser la connaissance historique à travers des conférences animées par
                  des chercheurs et des passionnés.
                </p>
              </div>
              <div className="mission-card">
                <h3>Échanger</h3>
                <p>
                  Créer un espace de dialogue où chacun peut partager ses réflexions et
                  questions sur l'histoire.
                </p>
              </div>
              <div className="mission-card">
                <h3>Découvrir</h3>
                <p>
                  Organiser des visites guidées et des événements culturels pour explorer
                  le patrimoine historique.
                </p>
              </div>
            </div>
          </div>

          <div className="values-section">
            <h2>Nos Valeurs</h2>
            <ul className="values-list">
              <li>
                <strong>Accessibilité</strong> - Rendre l'histoire accessible à tous, quel que
                soit le niveau de connaissance
              </li>
              <li>
                <strong>Rigueur</strong> - Garantir la qualité scientifique de nos contenus en
                collaborant avec des experts
              </li>
              <li>
                <strong>Convivialité</strong> - Favoriser les échanges dans une atmosphère
                chaleureuse et bienveillante
              </li>
              <li>
                <strong>Curiosité</strong> - Encourager l'exploration de toutes les périodes et
                régions historiques
              </li>
            </ul>
          </div>

          <div className="team-section">
            <h2>L'Équipe</h2>
            <p className="team-intro">
              Neastoria est animé par une équipe de bénévoles passionnés dévoués à la promotion
              de l'histoire et de la culture.
            </p>
            <div className="team-grid">
              <div className="team-member">
                <div className="member-avatar">👤</div>
                <h3>Sophie Laurent</h3>
                <p className="member-role">Présidente</p>
                <p>Historienne spécialisée en histoire romaine</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👤</div>
                <h3>Jean Martin</h3>
                <p className="member-role">Vice-président</p>
                <p>Professeur d'histoire moderne</p>
              </div>
              <div className="team-member">
                <div className="member-avatar">👤</div>
                <h3>Marie Dubois</h3>
                <p className="member-role">Secrétaire</p>
                <p>Docteure en histoire médiévale</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
