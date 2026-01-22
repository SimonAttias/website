# 🚀 Guide de configuration - Histoire Digest

## 📋 Prérequis

Avant de commencer, assurez-vous d'avoir :
- ✅ Un compte Notion
- ✅ Une page "Neastoria" dans Notion
- ✅ Un token d'intégration Notion
- ✅ Accès à votre repository GitHub

## 🔑 Configuration des secrets GitHub

Pour que GitHub Actions puisse accéder à votre Notion, vous devez configurer des secrets :

### 1. Créer une intégration Notion (si pas déjà fait)

1. Allez sur https://www.notion.so/my-integrations
2. Cliquez sur **"+ New integration"**
3. Donnez un nom : `Histoire Digest`
4. Sélectionnez votre workspace
5. Copiez le **Internal Integration Token** (commence par `secret_...`)

### 2. Partager votre page avec l'intégration

1. Ouvrez votre page **"Neastoria"** dans Notion
2. Cliquez sur **"..."** (en haut à droite)
3. Allez dans **"Connections"**
4. Recherchez et ajoutez **"Histoire Digest"**

### 3. Configurer les secrets GitHub

1. Allez sur votre repository GitHub
2. Cliquez sur **Settings** → **Secrets and variables** → **Actions**
3. Cliquez sur **"New repository secret"**
4. Ajoutez les deux secrets suivants :

#### Secret 1 : NOTION_TOKEN
- **Name:** `NOTION_TOKEN`
- **Secret:** Votre token d'intégration (commence par `ntn_` ou `secret_`)

#### Secret 2 : NOTION_PARENT_PAGE_ID
- **Name:** `NOTION_PARENT_PAGE_ID`
- **Secret:** L'ID de votre page Neastoria

> 💡 **Astuce :** L'ID de la page se trouve dans l'URL de votre page Notion :
> `https://www.notion.so/PageName-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX`
> L'ID est la longue chaîne de caractères après le dernier tiret

## 🧪 Test manuel

### Test en local

```bash
cd histoire-digest
npm install
npm start
```

### Test via GitHub Actions

1. Allez sur votre repository GitHub
2. Cliquez sur **Actions**
3. Sélectionnez **"Histoire Digest - Revue Quotidienne"**
4. Cliquez sur **"Run workflow"** → **"Run workflow"**
5. Attendez quelques minutes et vérifiez les logs

## ⏰ Automatisation

Une fois configuré, le système s'exécutera automatiquement :
- **Tous les jours à 8h00 UTC** (9h00 CET / 10h00 CEST)
- Collecte les nouveautés des 7 sources
- Filtre les doublons
- Ajoute les nouveaux éléments dans Notion

## 🎨 Résultat dans Notion

Après la première exécution, vous verrez :
- Une nouvelle sous-page **"Actualité Historiographique"** dans votre page Neastoria
- Une base de données élégante avec icône 📚
- Les colonnes : Titre, Source, Catégorie, Type, Lien, Description, Date
- Des emojis par catégorie : 📕 (Édition), 🎙️ (Podcast), 🏛️ (Établissement)

## 🔧 Personnalisation

### Modifier l'heure d'exécution

Éditez `.github/workflows/histoire-digest.yml` :

```yaml
schedule:
  - cron: '0 8 * * *'  # Changez '8' pour une autre heure UTC
```

### Ajouter une nouvelle source

1. Éditez `config/sources.js`
2. Ajoutez votre source dans la bonne catégorie
3. Si nécessaire, créez un scraper dans `scrapers/html-scraper.js`

## ❓ Dépannage

### Le workflow ne s'exécute pas

- Vérifiez que les secrets sont bien configurés
- Vérifiez que la branche `claude/history-news-digest-39YCH` existe

### Erreur "Unauthorized" dans les logs

- Vérifiez que le token Notion est correct
- Vérifiez que l'intégration a accès à la page Neastoria

### Aucun élément collecté

- C'est normal les premiers jours si les sources n'ont pas publié de nouveau contenu
- Exécutez manuellement pour tester

## 📞 Support

Pour toute question ou problème, consultez le README.md ou les logs d'exécution dans GitHub Actions.
