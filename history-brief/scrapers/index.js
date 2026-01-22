/**
 * Orchestrateur de scraping
 */

import {
  scrapeCNRSEditions,
  scrapePUF,
  scrapePassesComposes
} from './publishers-scraper.js';

import {
  scrapeStoriavoce,
  scrapeOpCit,
  scrapeConcordanceDesTemps,
  scrapeLeCoursDelHistoire
} from './podcasts-scraper.js';

/**
 * Scrape toutes les sources
 */
export async function scrapeAll() {
  console.log('\nDébut du scraping...\n');
  const allItems = [];

  // Scrape publishers (6 months threshold)
  console.log('=== MAISONS D\'ÉDITION ===\n');

  const cnrsItems = await scrapeCNRSEditions();
  allItems.push(...cnrsItems);

  const pufItems = await scrapePUF();
  allItems.push(...pufItems);

  const passesComposesItems = await scrapePassesComposes();
  allItems.push(...passesComposesItems);

  // Scrape podcasts (1 month threshold)
  console.log('\n=== PODCASTS ===\n');

  const storiavoceItems = await scrapeStoriavoce();
  allItems.push(...storiavoceItems);

  const opcitItems = await scrapeOpCit();
  allItems.push(...opcitItems);

  const concordanceItems = await scrapeConcordanceDesTemps();
  allItems.push(...concordanceItems);

  const coursHistoireItems = await scrapeLeCoursDelHistoire();
  allItems.push(...coursHistoireItems);

  console.log(`\nTotal: ${allItems.length} éléments collectés\n`);
  return allItems;
}
