import './Blog.css';

function Blog() {
  const blogPosts = [
    {
      id: 1,
      title: "Les trésors cachés de l'histoire médiévale",
      author: "Marie Dubois",
      date: "2026-01-15",
      excerpt: "Découvrez les aspects méconnus de la vie quotidienne au Moyen Âge et les innovations surprenantes de cette période souvent mal comprise.",
      image: "📜"
    },
    {
      id: 2,
      title: "La Renaissance : un renouveau culturel européen",
      author: "Jean Martin",
      date: "2026-01-08",
      excerpt: "Comment la Renaissance a transformé l'art, la science et la pensée européenne, marquant la transition vers l'ère moderne.",
      image: "🎨"
    },
    {
      id: 3,
      title: "Les grandes explorations maritimes",
      author: "Sophie Laurent",
      date: "2025-12-20",
      excerpt: "L'époque des grandes découvertes a redéfini notre compréhension du monde et établi les premiers contacts entre civilisations éloignées.",
      image: "⛵"
    }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="blog-page">
      <section className="page-header">
        <h1>Blog</h1>
        <p>Articles, réflexions et analyses historiques</p>
      </section>

      <section className="blog-section">
        <div className="blog-container">
          <div className="blog-grid">
            {blogPosts.map(post => (
              <article key={post.id} className="blog-card">
                <div className="blog-image">
                  <span className="blog-emoji">{post.image}</span>
                </div>
                <div className="blog-content">
                  <div className="blog-meta">
                    <span className="blog-author">{post.author}</span>
                    <span className="blog-date">{formatDate(post.date)}</span>
                  </div>
                  <h2>{post.title}</h2>
                  <p>{post.excerpt}</p>
                  <button className="read-more">Lire la suite →</button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default Blog;
