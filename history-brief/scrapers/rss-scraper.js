/**
 * Scraper RSS générique
 */

import Parser from 'rss-parser';
import { subDays } from 'date-fns';

const parser = new Parser({
  timeout: 10000,
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
});

/**
 * Scrape un flux RSS
 */
export async function scrapeRSS(source) {
  try {
    const feed = await parser.parseURL(source.rssUrl);
    const yesterday = subDays(new Date(), 1);

    const items = feed.items
      .filter(item => {
        if (!item.pubDate) return true;
        const pubDate = new Date(item.pubDate);
        return pubDate >= yesterday;
      })
      .map(item => ({
        title: item.title,
        url: item.link,
        description: item.contentSnippet || item.content || '',
        date: item.pubDate ? new Date(item.pubDate) : new Date(),
        source: source.name,
        category: source.category,
        type: source.type
      }))
      .slice(0, 5); // Limiter à 5 éléments par source

    console.log(`✓ ${source.name}: ${items.length} nouveaux éléments`);
    return items;
  } catch (error) {
    console.error(`✗ Erreur scraping RSS ${source.name}:`, error.message);
    return [];
  }
}
