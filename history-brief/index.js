#!/usr/bin/env node
/**
 * History Brief - Daily historiographic news briefing
 * Collects latest publications from publishers, podcasts and research institutions
 * and sends them to an elegant Notion database
 */

import 'dotenv/config';
import { scrapeAll } from './scrapers/index.js';
import { getOrCreateDatabase, addItems } from './notion/client.js';
import { filterNewItems } from './utils/storage.js';

/**
 * Fonction principale
 */
async function main() {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║      📚 History Brief - Daily Briefing       ║');
  console.log('╚════════════════════════════════════════════════╝');
  console.log('');

  try {
    // 1. Scraper toutes les sources
    const allItems = await scrapeAll();

    if (allItems.length === 0) {
      console.log('ℹ️  Aucun nouvel élément trouvé aujourd\'hui.');
      return;
    }

    // 2. Filtrer les nouveaux éléments (éviter doublons)
    console.log('🔍 Filtrage des nouveaux éléments...');
    const newItems = await filterNewItems(allItems);

    if (newItems.length === 0) {
      console.log('ℹ️  Tous les éléments ont déjà été ajoutés précédemment.');
      return;
    }

    console.log(`✅ ${newItems.length} nouveaux éléments à ajouter\n`);

    // 3. Obtenir ou créer la base de données Notion
    const databaseId = await getOrCreateDatabase();

    // 4. Ajouter les nouveaux éléments
    const results = await addItems(databaseId, newItems);

    console.log('╔════════════════════════════════════════════════╗');
    console.log('║                  ✨ TERMINÉ ✨                 ║');
    console.log('╚════════════════════════════════════════════════╝');
    console.log(`\n📊 ${results.successCount} éléments ajoutés avec succès !`);

    if (results.errorCount > 0) {
      console.log(`⚠️  ${results.errorCount} erreurs rencontrées`);
    }

  } catch (error) {
    console.error('\n❌ Erreur fatale:', error);
    process.exit(1);
  }
}

// Lancer le programme
main();
