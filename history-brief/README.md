# 📚 History Brief

Automated daily historiographic news briefing system for Notion.

## 🎯 Objective

Collect daily latest publications, podcast episodes and news from major French historiographic sources and organize them in an elegant Notion database.

## 📋 Monitored Sources

### Publishers
- **Passés Composés** - New releases
- **PUF** (Presses Universitaires de France) - News and new books
- **CNRS Éditions** - Scientific publications

### Podcasts
- **Storiavoce** - History & Civilizations Podcast (via RSS)
- **OpCit!** - IHMC Podcast (via RSS)

### Research Institutions
- **EHESS** - École des hautes études en sciences sociales
- **CNRS** - Centre National de la Recherche Scientifique (via RSS)

## ⚙️ Installation

```bash
cd history-brief
npm install
```

## 🔑 Configuration

### Environment Variables

Create a `.env` file (optional, default values are pre-configured):

```env
NOTION_TOKEN=your_notion_token
NOTION_PARENT_PAGE_ID=parent_page_id
```

### Share Notion page with integration

1. Open your "Neastoria" page in Notion
2. Click "..." → "Connections"
3. Add your integration

## 🚀 Usage

### Manual execution

```bash
npm start
```

### Test

```bash
npm test
```

## 🤖 Automation

### GitHub Actions (Recommended)

The system is configured to run daily via GitHub Actions.

**Configure secrets:**

1. Go to Settings → Secrets → Actions
2. Add `NOTION_TOKEN` with your integration token
3. Add `NOTION_PARENT_PAGE_ID` with your Neastoria page ID

The workflow will run automatically every day at 8:00 UTC.

## 📊 Notion Database Structure

The created database contains the following columns:

| Column | Type | Description |
|---------|------|-------------|
| **Titre** | Title | Publication/episode title |
| **Source** | Select | Source name (Passés Composés, PUF, etc.) |
| **Catégorie** | Select | Source type (Publisher, Podcast, Institution) |
| **Type** | Select | Technical category (publisher, podcast, institution) |
| **Lien** | URL | Resource link |
| **Description** | Rich Text | Description or excerpt |
| **Date** | Date | Publication date |
| **Ajouté le** | Created Time | Automatic addition date |

## 🛠️ Architecture

```
history-brief/
├── config/          # Sources and Notion configuration
├── scrapers/        # RSS and HTML scrapers
├── notion/          # Notion client and functions
├── utils/           # Utilities (storage, duplicate prevention)
├── data/            # Local data (history)
└── index.js         # Main entry point
```

## 🔧 Maintenance

### Add a new source

1. Add source in `config/sources.js`
2. Create scraper in `scrapers/html-scraper.js` or use RSS scraper
3. Add call in `scrapers/index.js`

### Prevent duplicates

The system uses MD5 hash of `title + url + source` to prevent duplicates. History is stored in `data/seen.json`.

## 📝 License

MIT
