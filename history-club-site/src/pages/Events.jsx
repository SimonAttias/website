import './Events.css';

function Events() {
  const upcomingEvents = [
    {
      id: 1,
      title: "La Renaissance italienne",
      speaker: "Dr. Marie Dubois",
      date: "2026-02-15",
      time: "19:00",
      location: "Bibliothèque Municipale",
      description: "Une plongée fascinante dans l'art et la culture de la Renaissance italienne, des Médicis à Michel-Ange.",
      price: "Gratuit pour les membres / 5€",
      availableSeats: 45
    },
    {
      id: 2,
      title: "Les grandes découvertes",
      speaker: "Discussion thématique",
      date: "2026-02-22",
      time: "18:30",
      location: "Salle Neastoria",
      description: "Échanges autour des expéditions maritimes qui ont changé le monde au XVe et XVIe siècles.",
      price: "Gratuit pour les membres / 3€",
      availableSeats: 30
    },
    {
      id: 3,
      title: "La Révolution française",
      speaker: "Prof. Jean Martin",
      date: "2026-03-08",
      time: "19:30",
      location: "Amphithéâtre Universitaire",
      description: "Analyse approfondie des événements révolutionnaires et de leur impact sur l'Europe moderne.",
      price: "Gratuit pour les membres / 5€",
      availableSeats: 60
    }
  ];

  const pastEvents = [
    {
      id: 4,
      title: "L'Empire romain",
      speaker: "Dr. Sophie Laurent",
      date: "2026-01-18",
      description: "Conférence sur l'organisation politique et militaire de l'Empire romain."
    },
    {
      id: 5,
      title: "Le Moyen Âge",
      speaker: "Prof. Pierre Durand",
      date: "2025-12-10",
      description: "Exploration de la vie quotidienne et des structures sociales médiévales."
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleRegister = (eventId) => {
    alert(`Inscription pour l'événement ${eventId} - Fonctionnalité de billetterie à venir`);
  };

  return (
    <div className="events-page">
      <section className="page-header">
        <h1>Nos événements</h1>
        <p>Découvrez nos conférences, discussions et activités culturelles</p>
      </section>

      <section className="events-section">
        <div className="events-container">
          <h2>À venir</h2>
          <div className="events-grid">
            {upcomingEvents.map(event => (
              <article key={event.id} className="event-detail-card">
                <div className="event-header">
                  <h3>{event.title}</h3>
                  <span className="event-speaker">{event.speaker}</span>
                </div>
                <div className="event-details">
                  <p className="event-datetime">
                    <strong>📅 {formatDate(event.date)}</strong> à {event.time}
                  </p>
                  <p className="event-location">📍 {event.location}</p>
                  <p className="event-description">{event.description}</p>
                  <div className="event-meta">
                    <span className="event-price">{event.price}</span>
                    <span className="event-seats">{event.availableSeats} places disponibles</span>
                  </div>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => handleRegister(event.id)}
                >
                  S'inscrire
                </button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="events-section past-events">
        <div className="events-container">
          <h2>Événements passés</h2>
          <div className="past-events-list">
            {pastEvents.map(event => (
              <article key={event.id} className="past-event-card">
                <div className="past-event-date">
                  {formatDate(event.date)}
                </div>
                <div className="past-event-info">
                  <h3>{event.title}</h3>
                  <p className="event-speaker">{event.speaker}</p>
                  <p>{event.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Events;
