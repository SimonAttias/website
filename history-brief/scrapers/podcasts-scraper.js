/**
 * Scrapers pour les podcasts avec extraction précise des invités
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { isWithinWeeks, extractDateFromText } from '../utils/date-utils.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchPage(url) {
  const response = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT }
  });
  return await response.text();
}

/**
 * Scrape Storiavoce
 * Invités : après "avec" dans le contenu de la page
 */
export async function scrapeStoriavoce() {
  try {
    console.log('Scraping Storiavoce...');
    const html = await fetchPage('https://storiavoce.com/');
    const $ = cheerio.load(html);
    const episodes = [];

    // Find episode links
    const episodeLinks = [];
    $('article a, .episode a, .podcast-item a, a[href*="/podcast/"]').each((i, el) => {
      let href = $(el).attr('href');
      if (href && !episodeLinks.includes(href)) {
        if (!href.startsWith('http') && !href.startsWith('//')) {
          href = 'https://storiavoce.com' + href;
        }
        episodeLinks.push(href);
      }
    });

    console.log(`  Found ${episodeLinks.length} episodes to check`);

    // Check each episode
    for (const link of episodeLinks.slice(0, 15)) {
      try {
        await delay(500);

        const epHtml = await fetchPage(link);
        const $ep = cheerio.load(epHtml);

        const title = $ep('h1').first().text().trim();
        const description = $ep('.description, .resume, .content, article p').first().text().trim();

        // Extract guests: search for "avec" in full page content
        let guests = '';
        const pageText = $ep('body').text();
        const guestMatch = pageText.match(/avec\s+([^.!?\n]+)/i);
        if (guestMatch) {
          guests = guestMatch[1].trim()
            .replace(/\s+/g, ' ') // normalize spaces
            .split(/\s*,\s*et\s*|\s*et\s*|\s*,\s*/)[0]; // take first guest if multiple
        }

        // Extract date
        let pubDate = null;
        $ep('time, .date, .published, [class*="date"]').each((i, el) => {
          const dateText = $ep(el).attr('datetime') || $ep(el).text();
          pubDate = extractDateFromText(dateText);
        });

        // Fallback: search in page text
        if (!pubDate) {
          pubDate = extractDateFromText(pageText);
        }

        // Only keep episodes from last 2 weeks
        if (pubDate && isWithinWeeks(pubDate, 2)) {
          episodes.push({
            title,
            author: guests || 'Invité non spécifié',
            date: pubDate,
            source: 'Storiavoce',
            description: description.slice(0, 300),
            url: link,
            type: 'podcast'
          });
        }
      } catch (err) {
        console.error(`  Error fetching episode ${link}:`, err.message);
      }
    }

    console.log(`  Found ${episodes.length} recent episodes`);
    return episodes;
  } catch (error) {
    console.error('Error scraping Storiavoce:', error.message);
    return [];
  }
}

/**
 * Scrape OpCit
 * Format: (date), Invité - Titre
 * Invité : entre ", " et " - "
 */
export async function scrapeOpCit() {
  try {
    console.log('Scraping OpCit...');
    const html = await fetchPage('https://ihmc.ens.psl.eu/-opcit-podcast-ihmc-.html');
    const $ = cheerio.load(html);
    const episodes = [];

    // Find episode items in the list
    $('.spip, article, .item, p, li').each((i, el) => {
      const text = $(el).text();

      // Match pattern: (date), Guest - Title
      const episodeMatch = text.match(/\(([^)]+)\),\s*([^-]+?)\s*-\s*(.+)/);

      if (episodeMatch) {
        const dateStr = episodeMatch[1].trim();
        const guest = episodeMatch[2].trim();
        const title = episodeMatch[3].trim();

        const pubDate = extractDateFromText(dateStr);

        if (pubDate && isWithinWeeks(pubDate, 2)) {
          // Try to find Spotify link nearby
          let spotifyLink = null;
          $(el).find('a[href*="spotify"]').each((i, linkEl) => {
            spotifyLink = $(linkEl).attr('href');
          });

          // Fallback: find any link in the element
          let episodeUrl = spotifyLink;
          if (!episodeUrl) {
            $(el).find('a').each((i, linkEl) => {
              const href = $(linkEl).attr('href');
              if (href && !episodeUrl) {
                episodeUrl = href.startsWith('http') ? href : `https://ihmc.ens.psl.eu${href}`;
              }
            });
          }

          episodes.push({
            title,
            author: guest,
            date: pubDate,
            source: 'OpCit',
            description: text.slice(0, 300),
            url: episodeUrl || 'https://ihmc.ens.psl.eu/-opcit-podcast-ihmc-.html',
            type: 'podcast'
          });
        }
      }
    });

    console.log(`  Found ${episodes.length} recent episodes`);
    return episodes;
  } catch (error) {
    console.error('Error scraping OpCit:', error.message);
    return [];
  }
}

/**
 * Scrape Radio France podcasts (Concordance des temps, Le cours de l'histoire)
 * Invités : <span class="qg-st4"> après <div>Avec</div>
 */
async function scrapeRadioFrance(baseUrl, podcastName) {
  try {
    console.log(`Scraping ${podcastName}...`);
    const html = await fetchPage(baseUrl);
    const $ = cheerio.load(html);
    const episodes = [];

    // Find episode links
    const episodeLinks = [];
    $('a[href*="/podcasts/"]').each((i, el) => {
      let href = $(el).attr('href');
      if (href && !episodeLinks.includes(href) && href !== baseUrl) {
        if (!href.startsWith('http')) {
          href = 'https://www.radiofrance.fr' + href;
        }
        episodeLinks.push(href);
      }
    });

    console.log(`  Found ${episodeLinks.length} episodes to check`);

    // Check each episode
    for (const link of episodeLinks.slice(0, 15)) {
      try {
        await delay(500);

        const epHtml = await fetchPage(link);
        const $ep = cheerio.load(epHtml);

        const title = $ep('h1').first().text().trim();
        const description = $ep('p.description, .description, [class*="description"]').first().text().trim();

        // Extract guests: look for "Avec" div followed by span.qg-st4
        let guests = '';
        const bodyHtml = $ep('body').html();

        // Try to find pattern: Avec</div> ... <span class="qg-st4">Guest Name</span>
        const avecMatch = bodyHtml.match(/Avec<\/div>[\s\S]*?<span class="qg-st4">(.*?)<\/span>/i);
        if (avecMatch) {
          guests = avecMatch[1].trim();
        }

        // Fallback: search for "avec" in text
        if (!guests) {
          const pageText = $ep('body').text();
          const guestMatch = pageText.match(/avec\s+([^.!?\n]+)/i);
          if (guestMatch) {
            guests = guestMatch[1].trim().split(/\s*,\s*/)[0];
          }
        }

        // Extract date
        let pubDate = null;
        $ep('time, [datetime], .date, [class*="date"]').each((i, el) => {
          const dateText = $ep(el).attr('datetime') || $ep(el).text();
          pubDate = extractDateFromText(dateText);
        });

        // Only keep episodes from last 2 weeks
        if (pubDate && isWithinWeeks(pubDate, 2)) {
          episodes.push({
            title,
            author: guests || 'Invité non spécifié',
            date: pubDate,
            source: podcastName,
            description: description.slice(0, 300),
            url: link,
            type: 'podcast'
          });
        }
      } catch (err) {
        console.error(`  Error fetching episode ${link}:`, err.message);
      }
    }

    console.log(`  Found ${episodes.length} recent episodes`);
    return episodes;
  } catch (error) {
    console.error(`Error scraping ${podcastName}:`, error.message);
    return [];
  }
}

/**
 * Scrape Concordance des temps
 */
export async function scrapeConcordanceDesTemps() {
  return await scrapeRadioFrance(
    'https://www.radiofrance.fr/franceculture/podcasts/concordance-des-temps',
    'Concordance des temps'
  );
}

/**
 * Scrape Le cours de l'histoire
 */
export async function scrapeLeCoursDelHistoire() {
  return await scrapeRadioFrance(
    'https://www.radiofrance.fr/franceculture/podcasts/le-cours-de-l-histoire',
    'Le cours de l\'histoire'
  );
}
