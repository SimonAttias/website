/**
 * Scrapers pour les podcasts avec extraction précise des invités et descriptions
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
 * Invités : après "avec" dans le contenu
 * Description : depuis <meta property="og:description"> ou <meta property="twitter:description">
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

        // Extract description from meta tags
        let description = $ep('meta[property="og:description"]').attr('content') ||
                         $ep('meta[property="twitter:description"]').attr('content') || '';
        description = description.trim();

        // Extract guests: search for "avec" in full page content
        let guests = '';
        const pageText = $ep('body').text();
        const guestMatch = pageText.match(/avec\s+([^.!?\n]+)/i);
        if (guestMatch) {
          guests = guestMatch[1].trim()
            .replace(/\s+/g, ' ')
            .split(/\s*,\s*et\s*|\s*et\s*|\s*,\s*/)[0];
        }

        // Extract date
        let pubDate = null;
        $ep('time, .date, .published, [class*="date"]').each((i, el) => {
          const dateText = $ep(el).attr('datetime') || $ep(el).text();
          pubDate = extractDateFromText(dateText);
        });

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
 * Pas de description
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
            description: '', // Pas de description pour OpCit
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
 * Scrape Concordance des temps
 * Invités : depuis "guest":[{« NOM »
 * Description : depuis <meta name="description" content="...">
 */
export async function scrapeConcordanceDesTemps() {
  try {
    console.log('Scraping Concordance des temps...');
    const html = await fetchPage('https://www.radiofrance.fr/franceculture/podcasts/concordance-des-temps');
    const $ = cheerio.load(html);
    const episodes = [];

    // Find episode links
    const episodeLinks = [];
    $('a[href*="/podcasts/concordance-des-temps/"]').each((i, el) => {
      let href = $(el).attr('href');
      if (href && !episodeLinks.includes(href)) {
        if (!href.startsWith('http')) {
          href = 'https://www.radiofrance.fr' + href;
        }
        // Avoid base URL
        if (!href.endsWith('/concordance-des-temps')) {
          episodeLinks.push(href);
        }
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

        // Extract description from meta tag
        let description = $ep('meta[name="description"]').attr('content') || '';

        // Extract guests: look for "guest":[{« Name »
        let guests = '';
        const pageText = $ep('body').text();
        const guestJsonMatch = pageText.match(/"guest":\s*\[\s*\{\s*«\s*([^»]+)\s*»/i);
        if (guestJsonMatch) {
          guests = guestJsonMatch[1].trim();
        }

        // Fallback: try Avec</div> ... <span class="qg-st4">
        if (!guests) {
          const bodyHtml = $ep('body').html();
          const avecMatch = bodyHtml.match(/Avec<\/div>[\s\S]*?<span class="qg-st4">(.*?)<\/span>/i);
          if (avecMatch) {
            guests = avecMatch[1].trim();
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
            source: 'Concordance des temps',
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
    console.error('Error scraping Concordance des temps:', error.message);
    return [];
  }
}

/**
 * Scrape Le cours de l'histoire
 * Invités : depuis "guest":[{« NOM »
 * Description : depuis <meta name="description">, en retirant le préfixe "- Le Cours de l'histoire - par : ..."
 */
export async function scrapeLeCoursDelHistoire() {
  try {
    console.log('Scraping Le cours de l\'histoire...');
    const html = await fetchPage('https://www.radiofrance.fr/franceculture/podcasts/le-cours-de-l-histoire');
    const $ = cheerio.load(html);
    const episodes = [];

    // Find episode links
    const episodeLinks = [];
    $('a[href*="/podcasts/le-cours-de-l-histoire/"]').each((i, el) => {
      let href = $(el).attr('href');
      if (href && !episodeLinks.includes(href)) {
        if (!href.startsWith('http')) {
          href = 'https://www.radiofrance.fr' + href;
        }
        // Avoid base URL
        if (!href.endsWith('/le-cours-de-l-histoire')) {
          episodeLinks.push(href);
        }
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

        // Extract description from meta tag
        let description = $ep('meta[name="description"]').attr('content') || '';

        // Clean Radio France prefix: "- Le Cours de l'histoire - par : Xavier Mauduit, Maïwenn Guiziou -"
        description = description.replace(/^-\s*Le Cours de l'histoire\s*-\s*par\s*:\s*[^-]+-\s*/i, '');
        description = description.replace(/^-\s*[^-]+-\s*par\s*:\s*[^-]+-\s*/i, '');
        description = description.replace(/^-\s*[^-]+-\s*/i, '');
        description = description.trim();

        // Extract guests: look for "guest":[{« Name »
        let guests = '';
        const pageText = $ep('body').text();
        const guestJsonMatch = pageText.match(/"guest":\s*\[\s*\{\s*«\s*([^»]+)\s*»/i);
        if (guestJsonMatch) {
          guests = guestJsonMatch[1].trim();
        }

        // Fallback: try Avec</div> ... <span class="qg-st4">
        if (!guests) {
          const bodyHtml = $ep('body').html();
          const avecMatch = bodyHtml.match(/Avec<\/div>[\s\S]*?<span class="qg-st4">(.*?)<\/span>/i);
          if (avecMatch) {
            guests = avecMatch[1].trim();
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
            source: 'Le cours de l\'histoire',
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
    console.error('Error scraping Le cours de l\'histoire:', error.message);
    return [];
  }
}
