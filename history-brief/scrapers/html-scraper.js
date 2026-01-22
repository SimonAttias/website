/**
 * Scraper HTML générique
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

/**
 * Scrape Passés Composés
 */
export async function scrapePassesComposes() {
  try {
    const response = await fetch('https://passes-composes.com/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const items = [];

    // Chercher les livres dans la section nouveautés
    $('.book, .product, article').slice(0, 5).each((i, el) => {
      const $el = $(el);
      let title = $el.find('h2, h3, .title, .book-title').first().text().trim();
      let url = $el.find('a').first().attr('href');

      if (title && url) {
        if (!url.startsWith('http')) {
          url = 'https://passes-composes.com' + url;
        }
        items.push({
          title,
          url,
          description: $el.find('p, .description').first().text().trim().slice(0, 200),
          date: new Date(),
          source: 'Passés Composés',
          category: 'Maison d\'édition',
          type: 'publisher'
        });
      }
    });

    console.log(`✓ Passés Composés: ${items.length} éléments`);
    return items;
  } catch (error) {
    console.error('✗ Erreur scraping Passés Composés:', error.message);
    return [];
  }
}

/**
 * Scrape PUF
 */
export async function scrapePUF() {
  try {
    const response = await fetch('https://www.puf.com/actualites', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const items = [];

    $('.news-item, article, .actualite').slice(0, 5).each((i, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, .title').first().text().trim();
      let url = $el.find('a').first().attr('href');

      if (title && url) {
        if (!url.startsWith('http')) {
          url = 'https://www.puf.com' + url;
        }
        items.push({
          title,
          url,
          description: $el.find('p, .description, .excerpt').first().text().trim().slice(0, 200),
          date: new Date(),
          source: 'PUF',
          category: 'Maison d\'édition',
          type: 'publisher'
        });
      }
    });

    console.log(`✓ PUF: ${items.length} éléments`);
    return items;
  } catch (error) {
    console.error('✗ Erreur scraping PUF:', error.message);
    return [];
  }
}

/**
 * Scrape CNRS Éditions
 */
export async function scrapeCNRSEditions() {
  try {
    const response = await fetch('https://www.cnrseditions.fr/actualites/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const items = [];

    $('.news-item, article, .actualite').slice(0, 5).each((i, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, .title').first().text().trim();
      let url = $el.find('a').first().attr('href');

      if (title && url) {
        if (!url.startsWith('http')) {
          url = 'https://www.cnrseditions.fr' + url;
        }
        items.push({
          title,
          url,
          description: $el.find('p, .description').first().text().trim().slice(0, 200),
          date: new Date(),
          source: 'CNRS Éditions',
          category: 'Maison d\'édition',
          type: 'publisher'
        });
      }
    });

    console.log(`✓ CNRS Éditions: ${items.length} éléments`);
    return items;
  } catch (error) {
    console.error('✗ Erreur scraping CNRS Éditions:', error.message);
    return [];
  }
}

/**
 * Scrape EHESS
 */
export async function scrapeEHESS() {
  try {
    const response = await fetch('https://www.ehess.fr/fr', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    const html = await response.text();
    const $ = cheerio.load(html);

    const items = [];

    $('.news-item, article, .actualite, .event').slice(0, 5).each((i, el) => {
      const $el = $(el);
      const title = $el.find('h2, h3, .title').first().text().trim();
      let url = $el.find('a').first().attr('href');

      if (title && url) {
        if (!url.startsWith('http')) {
          url = 'https://www.ehess.fr' + url;
        }
        items.push({
          title,
          url,
          description: $el.find('p, .description').first().text().trim().slice(0, 200),
          date: new Date(),
          source: 'EHESS',
          category: 'Établissement',
          type: 'institution'
        });
      }
    });

    console.log(`✓ EHESS: ${items.length} éléments`);
    return items;
  } catch (error) {
    console.error('✗ Erreur scraping EHESS:', error.message);
    return [];
  }
}
