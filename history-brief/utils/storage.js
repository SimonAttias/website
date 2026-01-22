/**
 * Utilitaire de stockage pour éviter les doublons
 */

import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const SEEN_FILE = join(DATA_DIR, 'seen.json');

/**
 * Génère un hash unique pour un élément
 */
export function generateHash(item) {
  const data = `${item.title}-${item.url}-${item.source}`;
  return crypto.createHash('md5').update(data).digest('hex');
}

/**
 * Charge les éléments déjà vus
 */
export async function loadSeenItems() {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const data = await readFile(SEEN_FILE, 'utf-8');
    return new Set(JSON.parse(data));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return new Set();
    }
    throw error;
  }
}

/**
 * Sauvegarde les éléments vus
 */
export async function saveSeenItems(seenSet) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(SEEN_FILE, JSON.stringify([...seenSet], null, 2));
}

/**
 * Filtre les nouveaux éléments
 */
export async function filterNewItems(items) {
  const seen = await loadSeenItems();
  const newItems = [];
  const newHashes = new Set(seen);

  for (const item of items) {
    const hash = generateHash(item);
    if (!seen.has(hash)) {
      newItems.push(item);
      newHashes.add(hash);
    }
  }

  await saveSeenItems(newHashes);
  return newItems;
}
