/**
 * Scrapers pour les maisons d'édition
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { parseFrenchDate, isWithinMonths, extractDateFromText } from '../utils/date-utils.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

/**
 * Helper to fetch a page
 */
async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });
  return await response.text();
}

/**
 * Helper to delay between requests (be polite)
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Scrape CNRS Éditions
 * URL: https://www.cnrseditions.fr/discipline/histoire/
 */
export async function scrapeCNRSEditions() {
  try {
    console.log('Scraping CNRS Éditions...');
    const html = await fetchPage('https://www.cnrseditions.fr/discipline/histoire/');
    const $ = cheerio.load(html);
    const books = [];

    // Find all book links
    const bookLinks = [];
    $('.product-item a.product-link, .livre a, article a').each((i, el) => {
      let href = $(el).attr('href');
      if (href && href.includes('/catalogue/') && !bookLinks.includes(href)) {
        if (!href.startsWith('http')) {
          href = 'https://www.cnrseditions.fr' + href;
        }
        bookLinks.push(href);
      }
    });

    console.log(`  Found ${bookLinks.length} books to check`);

    // Fetch each book page (limit to avoid overwhelming)
    for (const link of bookLinks.slice(0, 20)) {
      try {
        await delay(500); // Be polite, wait 500ms between requests

        const bookHtml = await fetchPage(link);
        const $book = cheerio.load(bookHtml);

        const title = $book('h1').first().text().trim();
        const author = $book('.auteur, .author, [itemprop="author"]').first().text().trim();
        const description = $book('.description, .resume, [itemprop="description"]').first().text().trim();

        // Look for publication date in "Details" section
        let publicationDate = null;
        $book('table tr, .details dd, .info-livre dt, .info-livre dd').each((i, el) => {
          const text = $book(el).text().toLowerCase();
          if (text.includes('parution') || text.includes('publication')) {
            const nextText = $book(el).next().text() || $book(el).text();
            publicationDate = extractDateFromText(nextText);
          }
        });

        // Fallback: search entire page for date patterns
        if (!publicationDate) {
          const bodyText = $book('body').text();
          publicationDate = extractDateFromText(bodyText);
        }

        // Only keep books from last 2 months
        if (publicationDate && isWithinMonths(publicationDate, 2)) {
          books.push({
            title,
            author: author || 'Auteur inconnu',
            date: publicationDate,
            source: 'CNRS Éditions',
            description: description.slice(0, 300),
            url: link,
            type: 'publisher'
          });
        }
      } catch (err) {
        console.error(`  Error fetching book ${link}:`, err.message);
      }
    }

    console.log(`  Found ${books.length} recent books`);
    return books;
  } catch (error) {
    console.error('Error scraping CNRS Éditions:', error.message);
    return [];
  }
}

/**
 * Scrape PUF
 * URL: https://www.puf.com/disciplines/histoire-et-art
 */
export async function scrapePUF() {
  try {
    console.log('Scraping PUF...');
    const html = await fetchPage('https://www.puf.com/disciplines/histoire-et-art');
    const $ = cheerio.load(html);
    const books = [];

    // Find all book links with "histoire" in subdiscipline
    const bookLinks = [];
    $('.product-item a, .livre a, article a').each((i, el) => {
      let href = $(el).attr('href');
      if (href && href.includes('/content/') && !bookLinks.includes(href)) {
        if (!href.startsWith('http')) {
          href = 'https://www.puf.com' + href;
        }
        bookLinks.push(href);
      }
    });

    console.log(`  Found ${bookLinks.length} books to check`);

    // Fetch each book page
    for (const link of bookLinks.slice(0, 20)) {
      try {
        await delay(500);

        const bookHtml = await fetchPage(link);
        const $book = cheerio.load(bookHtml);

        const title = $book('h1').first().text().trim();
        const author = $book('.auteur, .author, .field-name-field-auteur').first().text().trim();
        const description = $book('.description, .resume, .field-name-body').first().text().trim();

        // Look for publication date
        let publicationDate = null;
        $book('.field-name-field-date-parution, .parution, .date-publication').each((i, el) => {
          const text = $book(el).text();
          publicationDate = extractDateFromText(text);
        });

        // Fallback
        if (!publicationDate) {
          const bodyText = $book('body').text();
          publicationDate = extractDateFromText(bodyText);
        }

        // Only keep books from last 2 months
        if (publicationDate && isWithinMonths(publicationDate, 2)) {
          books.push({
            title,
            author: author || 'Auteur inconnu',
            date: publicationDate,
            source: 'PUF',
            description: description.slice(0, 300),
            url: link,
            type: 'publisher'
          });
        }
      } catch (err) {
        console.error(`  Error fetching book ${link}:`, err.message);
      }
    }

    console.log(`  Found ${books.length} recent books`);
    return books;
  } catch (error) {
    console.error('Error scraping PUF:', error.message);
    return [];
  }
}

/**
 * Scrape Passés Composés
 * URL: https://passes-composes.com/catalogue?nouveaute=true
 */
export async function scrapePassesComposes() {
  try {
    console.log('Scraping Passés Composés...');
    const html = await fetchPage('https://passes-composes.com/catalogue?nouveaute=true');
    const $ = cheerio.load(html);
    const books = [];

    // Find all book links
    const bookLinks = [];
    $('.product a, .book a, .livre a, article a').each((i, el) => {
      let href = $(el).attr('href');
      if (href && href.includes('/livre/') && !bookLinks.includes(href)) {
        if (!href.startsWith('http')) {
          href = 'https://passes-composes.com' + href;
        }
        bookLinks.push(href);
      }
    });

    console.log(`  Found ${bookLinks.length} books to check`);

    // Fetch each book page
    for (const link of bookLinks.slice(0, 20)) {
      try {
        await delay(500);

        const bookHtml = await fetchPage(link);
        const $book = cheerio.load(bookHtml);

        const title = $book('h1, .titre, .book-title').first().text().trim();
        const author = $book('.auteur, .author, .book-author').first().text().trim();
        const description = $book('.description, .resume, .book-description').first().text().trim();

        // Look for publication date
        let publicationDate = null;
        $book('.parution, .date-parution, .publication-date, dt, dd').each((i, el) => {
          const text = $book(el).text().toLowerCase();
          if (text.includes('parution') || text.includes('sortie')) {
            const dateText = $book(el).next().text() || $book(el).text();
            publicationDate = extractDateFromText(dateText);
          }
        });

        // Fallback
        if (!publicationDate) {
          const bodyText = $book('body').text();
          publicationDate = extractDateFromText(bodyText);
        }

        // Only keep books from last 2 months
        if (publicationDate && isWithinMonths(publicationDate, 2)) {
          books.push({
            title,
            author: author || 'Auteur inconnu',
            date: publicationDate,
            source: 'Passés Composés',
            description: description.slice(0, 300),
            url: link,
            type: 'publisher'
          });
        }
      } catch (err) {
        console.error(`  Error fetching book ${link}:`, err.message);
      }
    }

    console.log(`  Found ${books.length} recent books`);
    return books;
  } catch (error) {
    console.error('Error scraping Passés Composés:', error.message);
    return [];
  }
}
