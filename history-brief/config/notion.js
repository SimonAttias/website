/**
 * Configuration Notion
 */

// L'ID de la page est extrait de l'URL Notion
// Format : https://www.notion.so/PageName-ID
export const NOTION_CONFIG = {
  token: process.env.NOTION_TOKEN,
  parentPageId: process.env.NOTION_PARENT_PAGE_ID,
  databaseName: 'History Brief'
};

if (!NOTION_CONFIG.token || !NOTION_CONFIG.parentPageId) {
  console.error('❌ Erreur: Variables d\'environnement manquantes!');
  console.error('   Configurez NOTION_TOKEN et NOTION_PARENT_PAGE_ID');
  console.error('   Voir SETUP.md pour les instructions');
  process.exit(1);
}
