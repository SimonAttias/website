/**
 * Client Notion pour gérer la base de données
 */

import { Client } from '@notionhq/client';
import { NOTION_CONFIG } from '../config/notion.js';
import { format } from 'date-fns';
import { getTodayFormatted } from '../utils/date-utils.js';

const notion = new Client({ auth: NOTION_CONFIG.token });

/**
 * Créer ou trouver la page du brief du jour
 */
export async function getOrCreateDatabase() {
  try {
    const todayTitle = `📋 Brief du ${getTodayFormatted()}`;
    console.log(`Recherche ou création de la page: ${todayTitle}`);

    // Search for today's database
    const response = await notion.search({
      filter: { property: 'object', value: 'database' },
      query: todayTitle
    });

    if (response.results.length > 0) {
      console.log('Base de données du jour trouvée');
      return response.results[0].id;
    }

    // Create new database for today
    console.log('Création de la base de données du jour...');
    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: NOTION_CONFIG.parentPageId
      },
      title: [
        {
          type: 'text',
          text: { content: todayTitle }
        }
      ],
      properties: {
        'Titre': {
          title: {}
        },
        'Auteur': {
          rich_text: {}
        },
        'Date de parution': {
          date: {}
        },
        'Source': {
          select: {
            options: [
              { name: 'Passés Composés', color: 'blue' },
              { name: 'PUF', color: 'purple' },
              { name: 'CNRS Éditions', color: 'pink' },
              { name: 'Storiavoce', color: 'orange' },
              { name: 'OpCit', color: 'yellow' },
              { name: 'Concordance des temps', color: 'green' },
              { name: 'Le cours de l\'histoire', color: 'red' }
            ]
          }
        },
        'Description': {
          rich_text: {}
        },
        'Lien': {
          url: {}
        }
      }
    });

    console.log('Base de données créée avec succès');
    return database.id;
  } catch (error) {
    console.error('Erreur lors de la création/récupération de la base:', error.message);
    throw error;
  }
}

/**
 * Ajoute des items à la base de données
 */
export async function addItems(databaseId, items) {
  console.log(`\nAjout de ${items.length} éléments à Notion...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const item of items) {
    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        properties: {
          'Titre': {
            title: [
              {
                text: { content: item.title.slice(0, 2000) }
              }
            ]
          },
          'Auteur': {
            rich_text: [
              {
                text: { content: (item.author || '').slice(0, 2000) }
              }
            ]
          },
          'Date de parution': {
            date: item.date ? {
              start: format(new Date(item.date), 'yyyy-MM-dd')
            } : null
          },
          'Source': {
            select: { name: item.source }
          },
          'Description': {
            rich_text: [
              {
                text: { content: (item.description || '').slice(0, 2000) }
              }
            ]
          },
          'Lien': {
            url: item.url
          }
        }
      });

      successCount++;
      console.log(`  ${item.source}: ${item.title.slice(0, 60)}...`);
    } catch (error) {
      errorCount++;
      console.error(`  Erreur pour "${item.title.slice(0, 40)}":`, error.message);
    }
  }

  console.log(`\nRésultats: ${successCount} réussis, ${errorCount} erreurs\n`);
  return { successCount, errorCount };
}
