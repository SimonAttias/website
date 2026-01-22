/**
 * Orchestrateur de scraping
 */

import { SOURCES } from '../config/sources.js';
import { scrapeRSS } from './rss-scraper.js';
import {
  scrapePassesComposes,
  scrapePUF,
  scrapeCNRSEditions,
  scrapeEHESS
} from './html-scraper.js';

/**
 * Scrape toutes les sources
 */
export async function scrapeAll() {
  console.log('\n🔍 Début du scraping...\n');
  const allItems = [];

  // Scrape les podcasts (RSS)
  for (const podcast of SOURCES.podcasts) {
    const items = await scrapeRSS(podcast);
    allItems.push(...items);
  }

  // Scrape CNRS (RSS)
  const cnrsSource = SOURCES.institutions.find(s => s.name === 'CNRS');
  if (cnrsSource && cnrsSource.rssUrl) {
    const items = await scrapeRSS(cnrsSource);
    allItems.push(...items);
  }

  // Scrape les maisons d'édition (HTML)
  const passesComposesItems = await scrapePassesComposes();
  allItems.push(...passesComposesItems);

  const pufItems = await scrapePUF();
  allItems.push(...pufItems);

  const cnrsEditionsItems = await scrapeCNRSEditions();
  allItems.push(...cnrsEditionsItems);

  // Scrape EHESS (HTML)
  const ehessItems = await scrapeEHESS();
  allItems.push(...ehessItems);

  console.log(`\n✅ Total: ${allItems.length} éléments collectés\n`);
  return allItems;
}
