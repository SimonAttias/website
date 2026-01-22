/**
 * Scrapers pour les podcasts
 */

import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import Parser from 'rss-parser';
import { isWithinMonths, extractDateFromText } from '../utils/date-utils.js';

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
const rssParser = new Parser();

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
 * URL: https://storiavoce.com/
 */
export async function scrapeStoriavoce() {
  try {
    console.log('Scraping Storiavoce...');
    const html = await fetchPage('https://storiavoce.com/');
    const $ = cheerio.load(html);
    const episodes = [];

    // Find episode links
    const episodeLinks = [];
    $('article a, .episode a, .podcast-item a').each((i, el) => {
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

        // Extract guests/participants
        let guests = $ep('.invites, .guests, .participants').first().text().trim();
        if (!guests) {
          // Try to find in description
          const desc = $ep('.description, .content, article').text();
          const guestMatch = desc.match(/avec\s+([^.!?]+)/i);
          if (guestMatch) {
            guests = guestMatch[1].trim();
          }
        }

        const description = $ep('.description, .resume, .content').first().text().trim();

        // Extract date
        let pubDate = null;
        $ep('time, .date, .published').each((i, el) => {
          const dateText = $ep(el).attr('datetime') || $ep(el).text();
          pubDate = extractDateFromText(dateText);
        });

        // Only keep episodes from last month
        if (pubDate && isWithinMonths(pubDate, 1)) {
          episodes.push({
            title,
            author: guests || 'Invités non spécifiés',
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
 * URL: https://ihmc.ens.psl.eu/-opcit-podcast-ihmc-.html
 */
export async function scrapeOpCit() {
  try {
    console.log('Scraping OpCit...');
    const html = await fetchPage('https://ihmc.ens.psl.eu/-opcit-podcast-ihmc-.html');
    const $ = cheerio.load(html);
    const episodes = [];

    // Find episode links
    const episodeLinks = [];
    $('article a, .episode a, .podcast-item a').each((i, el) => {
      let href = $(el).attr('href');
      if (href && !episodeLinks.includes(href)) {
        if (!href.startsWith('http') && !href.startsWith('//')) {
          href = 'https://ihmc.ens.psl.eu' + href;
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

        const title = $ep('h1, h2.title').first().text().trim();

        // Extract guests
        let guests = $ep('.invites, .guests').first().text().trim();
        if (!guests) {
          const desc = $ep('.description, .content, article').text();
          const guestMatch = desc.match(/avec\s+([^.!?]+)/i);
          if (guestMatch) {
            guests = guestMatch[1].trim();
          }
        }

        const description = $ep('.description, .content, article p').first().text().trim();

        // Extract date
        let pubDate = null;
        $ep('time, .date, .published').each((i, el) => {
          const dateText = $ep(el).attr('datetime') || $ep(el).text();
          pubDate = extractDateFromText(dateText);
        });

        // Try to find Spotify link
        let spotifyLink = null;
        $ep('a[href*="spotify"]').each((i, el) => {
          spotifyLink = $ep(el).attr('href');
        });

        const finalUrl = spotifyLink || link;

        // Only keep episodes from last month
        if (pubDate && isWithinMonths(pubDate, 1)) {
          episodes.push({
            title,
            author: guests || 'Invités non spécifiés',
            date: pubDate,
            source: 'OpCit',
            description: description.slice(0, 300),
            url: finalUrl,
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
    console.error('Error scraping OpCit:', error.message);
    return [];
  }
}

/**
 * Scrape Radio France podcasts via RSS
 */
async function scrapeRadioFranceRSS(url, podcastName) {
  try {
    console.log(`Scraping ${podcastName}...`);
    const feed = await rssParser.parseURL(url);
    const episodes = [];

    for (const item of feed.items) {
      const pubDate = item.pubDate ? new Date(item.pubDate) : null;

      // Only keep episodes from last month
      if (pubDate && isWithinMonths(pubDate, 1)) {
        // Extract guests from title or description
        let guests = '';
        const titleMatch = item.title?.match(/avec\s+([^-:]+)/i);
        const descMatch = item.contentSnippet?.match(/avec\s+([^.!?]+)/i);

        if (titleMatch) {
          guests = titleMatch[1].trim();
        } else if (descMatch) {
          guests = descMatch[1].trim();
        }

        episodes.push({
          title: item.title,
          author: guests || 'Invités non spécifiés',
          date: pubDate,
          source: podcastName,
          description: (item.contentSnippet || item.content || '').slice(0, 300),
          url: item.link,
          type: 'podcast'
        });
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
  return await scrapeRadioFranceRSS(
    'https://radiofrance-podcast.net/podcast09/rss_10076.xml',
    'Concordance des temps'
  );
}

/**
 * Scrape Le cours de l'histoire
 */
export async function scrapeLeCoursDelHistoire() {
  return await scrapeRadioFranceRSS(
    'https://radiofrance-podcast.net/podcast09/rss_10165.xml',
    'Le cours de l\'histoire'
  );
}
