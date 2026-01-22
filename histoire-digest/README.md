# 📚 Histoire Digest

Système automatisé de revue journalière de l'actualité historiographique pour Notion.

## 🎯 Objectif

Collecter quotidiennement les dernières publications, épisodes de podcasts et actualités des principales sources historiographiques françaises et les organiser dans une base de données Notion élégante.

## 📋 Sources surveillées

### Maisons d'édition
- **Passés Composés** - Nouveautés éditoriales
- **PUF** (Presses Universitaires de France) - Actualités et nouveaux livres
- **CNRS Éditions** - Publications scientifiques

### Podcasts
- **Storiavoce** - Podcast d'Histoire & Civilisations (via RSS)
- **OpCit!** - Podcast de l'IHMC (via RSS)

### Établissements de recherche
- **EHESS** - École des hautes études en sciences sociales
- **CNRS** - Centre National de la Recherche Scientifique (via RSS)

## ⚙️ Installation

```bash
cd histoire-digest
npm install
```

## 🔑 Configuration

### Variables d'environnement

Créez un fichier `.env` (optionnel, les valeurs par défaut sont déjà configurées) :

```env
NOTION_TOKEN=votre_token_notion
NOTION_PARENT_PAGE_ID=id_de_la_page_parent
```

### Partager la page Notion avec l'intégration

1. Ouvrez votre page "Neastoria" dans Notion
2. Cliquez sur "..." → "Connections"
3. Ajoutez votre intégration

## 🚀 Utilisation

### Exécution manuelle

```bash
npm start
```

### Test

```bash
npm test
```

## 🤖 Automatisation

### GitHub Actions (Recommandé)

Le système est configuré pour s'exécuter quotidiennement via GitHub Actions.

**Configuration des secrets :**

1. Allez dans Settings → Secrets → Actions
2. Ajoutez `NOTION_TOKEN` avec votre token d'intégration
3. Ajoutez `NOTION_PARENT_PAGE_ID` avec l'ID de votre page Neastoria

Le workflow s'exécutera automatiquement tous les jours à 8h00 UTC.

## 📊 Structure de la base de données Notion

La base de données créée contient les colonnes suivantes :

| Colonne | Type | Description |
|---------|------|-------------|
| **Titre** | Title | Titre de la publication/épisode |
| **Source** | Select | Nom de la source (Passés Composés, PUF, etc.) |
| **Catégorie** | Select | Type de source (Maison d'édition, Podcast, Établissement) |
| **Type** | Select | Catégorie technique (publisher, podcast, institution) |
| **Lien** | URL | Lien vers la ressource |
| **Description** | Rich Text | Description ou extrait |
| **Date** | Date | Date de publication |
| **Ajouté le** | Created Time | Date d'ajout automatique |

## 🛠️ Architecture

```
histoire-digest/
├── config/          # Configuration des sources et Notion
├── scrapers/        # Scrapers RSS et HTML
├── notion/          # Client et fonctions Notion
├── utils/           # Utilitaires (stockage, éviter doublons)
├── data/            # Données locales (historique)
└── index.js         # Point d'entrée principal
```

## 🔧 Maintenance

### Ajouter une nouvelle source

1. Ajoutez la source dans `config/sources.js`
2. Créez un scraper dans `scrapers/html-scraper.js` ou utilisez le scraper RSS
3. Ajoutez l'appel dans `scrapers/index.js`

### Éviter les doublons

Le système utilise un hash MD5 de `titre + url + source` pour éviter les doublons. L'historique est stocké dans `data/seen.json`.

## 📝 Licence

MIT
