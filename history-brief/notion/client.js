/**
 * Client Notion pour gérer la base de données
 */

import { Client } from '@notionhq/client';
import { NOTION_CONFIG } from '../config/notion.js';
import { format } from 'date-fns';

const notion = new Client({ auth: NOTION_CONFIG.token });

/**
 * Trouve ou crée la base de données dans la page parent
 */
export async function getOrCreateDatabase() {
  try {
    // Rechercher une base de données existante
    const response = await notion.search({
      filter: { property: 'object', value: 'database' },
      query: NOTION_CONFIG.databaseName
    });

    if (response.results.length > 0) {
      console.log('✓ Base de données trouvée');
      return response.results[0].id;
    }

    // Créer une nouvelle base de données
    console.log('📝 Création de la base de données...');
    const database = await notion.databases.create({
      parent: {
        type: 'page_id',
        page_id: NOTION_CONFIG.parentPageId
      },
      title: [
        {
          type: 'text',
          text: { content: NOTION_CONFIG.databaseName }
        }
      ],
      icon: {
        type: 'emoji',
        emoji: '📚'
      },
      properties: {
        'Titre': {
          title: {}
        },
        'Source': {
          select: {
            options: [
              { name: 'Passés Composés', color: 'blue' },
              { name: 'PUF', color: 'purple' },
              { name: 'CNRS Éditions', color: 'pink' },
              { name: 'Storiavoce', color: 'orange' },
              { name: 'OpCit!', color: 'yellow' },
              { name: 'EHESS', color: 'green' },
              { name: 'CNRS', color: 'red' }
            ]
          }
        },
        'Catégorie': {
          select: {
            options: [
              { name: 'Maison d\'édition', color: 'blue' },
              { name: 'Podcast', color: 'orange' },
              { name: 'Établissement', color: 'green' }
            ]
          }
        },
        'Type': {
          select: {
            options: [
              { name: 'publisher', color: 'blue' },
              { name: 'podcast', color: 'orange' },
              { name: 'institution', color: 'green' }
            ]
          }
        },
        'Lien': {
          url: {}
        },
        'Description': {
          rich_text: {}
        },
        'Date': {
          date: {}
        },
        'Ajouté le': {
          created_time: {}
        }
      }
    });

    console.log('✅ Base de données créée avec succès');
    return database.id;
  } catch (error) {
    console.error('❌ Erreur lors de la création/récupération de la base:', error.message);
    throw error;
  }
}

/**
 * Ajoute des items à la base de données
 */
export async function addItems(databaseId, items) {
  console.log(`\n📤 Ajout de ${items.length} éléments à Notion...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const item of items) {
    try {
      await notion.pages.create({
        parent: { database_id: databaseId },
        icon: {
          type: 'emoji',
          emoji: getCategoryEmoji(item.category)
        },
        properties: {
          'Titre': {
            title: [
              {
                text: { content: item.title.slice(0, 2000) }
              }
            ]
          },
          'Source': {
            select: { name: item.source }
          },
          'Catégorie': {
            select: { name: item.category }
          },
          'Type': {
            select: { name: item.type }
          },
          'Lien': {
            url: item.url
          },
          'Description': {
            rich_text: [
              {
                text: { content: item.description.slice(0, 2000) }
              }
            ]
          },
          'Date': {
            date: {
              start: item.date ? format(new Date(item.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd')
            }
          }
        }
      });

      successCount++;
      console.log(`  ✓ ${item.source}: ${item.title.slice(0, 60)}...`);
    } catch (error) {
      errorCount++;
      console.error(`  ✗ Erreur pour "${item.title.slice(0, 40)}":`, error.message);
    }
  }

  console.log(`\n📊 Résultats: ${successCount} réussis, ${errorCount} erreurs\n`);
  return { successCount, errorCount };
}

/**
 * Retourne un emoji selon la catégorie
 */
function getCategoryEmoji(category) {
  const emojis = {
    'Maison d\'édition': '📕',
    'Podcast': '🎙️',
    'Établissement': '🏛️'
  };
  return emojis[category] || '📄';
}
