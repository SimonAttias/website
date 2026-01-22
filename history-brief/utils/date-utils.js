/**
 * Utilit

aires pour la gestion des dates
 */

import { subMonths, subWeeks, isAfter, parse, format } from 'date-fns';
import { fr } from 'date-fns/locale';

// Mois français
const FRENCH_MONTHS = {
  'janvier': 1, 'jan': 1,
  'février': 2, 'fév': 2, 'fevrier': 2, 'fev': 2,
  'mars': 3, 'mar': 3,
  'avril': 4, 'avr': 4,
  'mai': 5,
  'juin': 6, 'jun': 6,
  'juillet': 7, 'juil': 7,
  'août': 8, 'aout': 8, 'aoû': 8,
  'septembre': 9, 'sept': 9, 'sep': 9,
  'octobre': 10, 'oct': 10,
  'novembre': 11, 'nov': 11,
  'décembre': 12, 'déc': 12, 'dec': 12
};

/**
 * Parse une date française (ex: "15 janvier 2024", "janvier 2024", "2024")
 */
export function parseFrenchDate(dateStr) {
  if (!dateStr) return null;

  const normalized = dateStr.toLowerCase().trim();

  // Try: "DD mois YYYY" (ex: "15 janvier 2024")
  const match1 = normalized.match(/(\d{1,2})\s+(\w+)\s+(\d{4})/);
  if (match1) {
    const day = parseInt(match1[1]);
    const monthStr = match1[2];
    const year = parseInt(match1[3]);
    const month = FRENCH_MONTHS[monthStr];
    if (month) {
      return new Date(year, month - 1, day);
    }
  }

  // Try: "mois YYYY" (ex: "janvier 2024")
  const match2 = normalized.match(/(\w+)\s+(\d{4})/);
  if (match2) {
    const monthStr = match2[1];
    const year = parseInt(match2[2]);
    const month = FRENCH_MONTHS[monthStr];
    if (month) {
      return new Date(year, month - 1, 1);
    }
  }

  // Try: "YYYY" (ex: "2024")
  const match3 = normalized.match(/^(\d{4})$/);
  if (match3) {
    const year = parseInt(match3[1]);
    return new Date(year, 0, 1);
  }

  // Try ISO date
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) {
    return isoDate;
  }

  return null;
}

/**
 * Vérifie si une date est dans les X derniers mois
 */
export function isWithinMonths(date, months) {
  if (!date) return false;
  const threshold = subMonths(new Date(), months);
  return isAfter(date, threshold);
}

/**
 * Vérifie si une date est dans les X dernières semaines
 */
export function isWithinWeeks(date, weeks) {
  if (!date) return false;
  const threshold = subWeeks(new Date(), weeks);
  return isAfter(date, threshold);
}

/**
 * Formate la date actuelle en français (ex: "22 janvier")
 */
export function getTodayFormatted() {
  const today = new Date();
  return format(today, 'd MMMM', { locale: fr });
}

/**
 * Extrait une date d'un texte qui peut contenir "Parution: XX/XX/XXXX" ou formats français
 */
export function extractDateFromText(text) {
  if (!text) return null;

  // Try format "DD/MM/YYYY"
  const slashMatch = text.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (slashMatch) {
    const day = parseInt(slashMatch[1]);
    const month = parseInt(slashMatch[2]);
    const year = parseInt(slashMatch[3]);
    return new Date(year, month - 1, day);
  }

  // Try French format
  return parseFrenchDate(text);
}
