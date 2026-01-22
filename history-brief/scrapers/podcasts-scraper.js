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
 * Scrape Storiavoce depuis Spotify
 * Colonnes: Titre, Auteur (invités), Date de parution, Source, Description, Lien
 */
export async function scrapeStoriavoce() {
  try {
    console.log('Scraping Storiavoce from Spotify...');
    const showUrl = 'https://open.spotify.com/show/3q09jBiYIJ1NGnAMYuDQeH';
    const html = await fetchPage(showUrl);
    const $ = cheerio.load(html);
    const episodes = [];

    // Try to extract JSON data from Spotify's embedded data
    let jsonData = null;
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const content = $(el).html();
        const data = JSON.parse(content);
        if (data && data['@type'] === 'PodcastSeries') {
          jsonData = data;
        }
      } catch (e) {
        // Ignore parse errors
      }
    });

    // Try to extract from Next.js data
    $('script').each((i, el) => {
      const content = $(el).html();
      if (content && content.includes('__NEXT_DATA__')) {
        try {
          const match = content.match(/__NEXT_DATA__\s*=\s*({.+?})\s*<\/script>/);
          if (match) {
            const data = JSON.parse(match[1]);
            // Navigate through Spotify's data structure
            if (data.props && data.props.pageProps) {
              jsonData = data.props.pageProps;
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    });

    // If we have JSON data with episodes
    if (jsonData && jsonData.episodes) {
      for (const ep of jsonData.episodes.slice(0, 20)) {
        try {
          const title = ep.name || ep.title || '';
          const description = ep.description || '';
          const releaseDate = ep.releaseDate || ep.publishDate;

          let pubDate = null;
          if (releaseDate) {
            pubDate = extractDateFromText(releaseDate);
          }

          // Extract guests from description (look for "avec", "invité", etc.)
          let author = '';
          const guestMatch = description.match(/(?:avec|invité[s]?)[:\s]+([^.!?\n]+)/i);
          if (guestMatch) {
            author = guestMatch[1].trim()
              .replace(/\s+/g, ' ')
              .split(/\s*,\s*et\s*|\s*et\s*|\s*,\s*/)[0];
          }

          if (!author) {
            // Try to extract from title
            const titleMatch = title.match(/(?:avec|invité[s]?)[:\s]+([^-|]+)/i);
            if (titleMatch) {
              author = titleMatch[1].trim();
            }
          }

          // Only keep episodes from last 2 weeks
          if (pubDate && isWithinWeeks(pubDate, 2)) {
            const episodeUrl = ep.uri ? `https://open.spotify.com/episode/${ep.uri.split(':').pop()}` : showUrl;

            episodes.push({
              title,
              author: author || 'Invité non spécifié',
              date: pubDate,
              source: 'Storiavoce',
              description: description.slice(0, 300),
              url: episodeUrl,
              type: 'podcast'
            });
          }
        } catch (err) {
          console.error(`  Error processing episode:`, err.message);
        }
      }
    } else {
      console.log('  Could not extract episodes from Spotify JSON data');
      console.log('  Note: Spotify may require a browser environment to load episode data');
    }

    console.log(`  Found ${episodes.length} recent episodes`);
    return episodes;
  } catch (error) {
    console.error('Error scraping Storiavoce:', error.message);
    return [];
  }
}

/**
 * Scrape OpCit depuis Spotify
 * Colonnes: Titre, Auteur (invités), Date de parution, Source, Description, Lien
 */
export async function scrapeOpCit() {
  try {
    console.log('Scraping OpCit from Spotify...');
    const showUrl = 'https://open.spotify.com/show/4qyZY8ieJvMKj9tLUoLM7l';
    const html = await fetchPage(showUrl);
    const $ = cheerio.load(html);
    const episodes = [];

    // Try to extract JSON data from Spotify's embedded data
    let jsonData = null;
    $('script[type="application/ld+json"]').each((i, el) => {
      try {
        const content = $(el).html();
        const data = JSON.parse(content);
        if (data && data['@type'] === 'PodcastSeries') {
          jsonData = data;
        }
      } catch (e) {
        // Ignore parse errors
      }
    });

    // Try to extract from Next.js data
    $('script').each((i, el) => {
      const content = $(el).html();
      if (content && content.includes('__NEXT_DATA__')) {
        try {
          const match = content.match(/__NEXT_DATA__\s*=\s*({.+?})\s*<\/script>/);
          if (match) {
            const data = JSON.parse(match[1]);
            // Navigate through Spotify's data structure
            if (data.props && data.props.pageProps) {
              jsonData = data.props.pageProps;
            }
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    });

    // If we have JSON data with episodes
    if (jsonData && jsonData.episodes) {
      for (const ep of jsonData.episodes.slice(0, 20)) {
        try {
          const title = ep.name || ep.title || '';
          const description = ep.description || '';
          const releaseDate = ep.releaseDate || ep.publishDate;

          let pubDate = null;
          if (releaseDate) {
            pubDate = extractDateFromText(releaseDate);
          }

          // Extract guests from description or title
          let author = '';

          // Try pattern: "avec" or "invité"
          const guestMatch = description.match(/(?:avec|invité[s]?)[:\s]+([^.!?\n]+)/i);
          if (guestMatch) {
            author = guestMatch[1].trim()
              .replace(/\s+/g, ' ')
              .split(/\s*,\s*et\s*|\s*et\s*|\s*,\s*/)[0];
          }

          if (!author) {
            // Try to extract from title
            const titleMatch = title.match(/(?:avec|invité[s]?)[:\s]+([^-|]+)/i);
            if (titleMatch) {
              author = titleMatch[1].trim();
            }
          }

          // Only keep episodes from last 2 weeks
          if (pubDate && isWithinWeeks(pubDate, 2)) {
            const episodeUrl = ep.uri ? `https://open.spotify.com/episode/${ep.uri.split(':').pop()}` : showUrl;

            episodes.push({
              title,
              author: author || 'Invité non spécifié',
              date: pubDate,
              source: 'OpCit',
              description: description.slice(0, 300),
              url: episodeUrl,
              type: 'podcast'
            });
          }
        } catch (err) {
          console.error(`  Error processing episode:`, err.message);
        }
      }
    } else {
      console.log('  Could not extract episodes from Spotify JSON data');
      console.log('  Note: Spotify may require a browser environment to load episode data');
    }

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
