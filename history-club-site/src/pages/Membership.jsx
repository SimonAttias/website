import { useState } from 'react';
import './Membership.css';

function Membership() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    acceptTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Inscription en cours - Système de paiement et gestion des membres à venir');
    console.log('Form data:', formData);
  };

  return (
    <div className="membership-page">
      <section className="page-header">
        <h1>Nous rejoindre</h1>
        <p>Devenez membre de Neastoria</p>
      </section>

      <section className="membership-section">
        <div className="membership-container">
          <div className="membership-info">
            <h2>Pourquoi devenir membre ?</h2>
            <div className="benefits-grid">
              <div className="benefit">
                <span className="benefit-icon">🎟️</span>
                <h3>Accès privilégié</h3>
                <p>Entrée gratuite à tous nos événements et conférences</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📚</span>
                <h3>Contenus exclusifs</h3>
                <p>Accès à notre bibliothèque d'articles et de ressources</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">👥</span>
                <h3>Communauté</h3>
                <p>Rejoignez un réseau de passionnés d'histoire</p>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🔔</span>
                <h3>Priorité</h3>
                <p>Réservation prioritaire pour les événements à places limitées</p>
              </div>
            </div>

            <div className="pricing-card">
              <h3>Adhésion annuelle</h3>
              <div className="price">
                <span className="amount">20€</span>
                <span className="period">/ an</span>
              </div>
              <p>Valable 1 an à partir de la date d'inscription</p>
              <ul className="pricing-features">
                <li>✓ Accès gratuit à tous les événements</li>
                <li>✓ Newsletter mensuelle</li>
                <li>✓ Contenus exclusifs en ligne</li>
                <li>✓ Réductions partenaires</li>
                <li>✓ Renouvellement automatique avec rappel par email</li>
              </ul>
            </div>
          </div>

          <div className="membership-form-section">
            <h2>Formulaire d'inscription</h2>
            <form onSubmit={handleSubmit} className="membership-form">
              <div className="form-group">
                <label htmlFor="firstName">Prénom *</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Nom *</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <small>Vous recevrez un rappel avant l'expiration de votre abonnement</small>
              </div>

              <div className="form-group">
                <label htmlFor="phone">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>J'accepte les conditions générales et la politique de confidentialité *</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary submit-btn">
                Procéder au paiement (20€)
              </button>

              <p className="form-note">
                * Champs obligatoires<br />
                Le paiement sécurisé sera traité par notre partenaire de confiance.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Membership;
