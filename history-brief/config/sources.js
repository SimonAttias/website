/**
 * Configuration des sources à scraper
 */

export const SOURCES = {
  publishers: [
    {
      name: 'Passés Composés',
      url: 'https://passes-composes.com/',
      type: 'publisher',
      category: 'Maison d\'édition'
    },
    {
      name: 'PUF',
      url: 'https://www.puf.com/actualites',
      type: 'publisher',
      category: 'Maison d\'édition'
    },
    {
      name: 'CNRS Éditions',
      url: 'https://www.cnrseditions.fr/actualites/',
      type: 'publisher',
      category: 'Maison d\'édition'
    }
  ],
  podcasts: [
    {
      name: 'Storiavoce',
      url: 'https://storiavoce.com/',
      rssUrl: 'https://feeds.acast.com/public/shows/storiavoce-un-podcast-dhistoire-civilisations',
      type: 'podcast',
      category: 'Podcast'
    },
    {
      name: 'OpCit!',
      url: 'https://opcit-ihmc.lepodcast.fr/',
      rssUrl: 'https://opcit-ihmc.lepodcast.fr/rss',
      type: 'podcast',
      category: 'Podcast'
    }
  ],
  institutions: [
    {
      name: 'EHESS',
      url: 'https://www.ehess.fr/fr',
      type: 'institution',
      category: 'Établissement'
    },
    {
      name: 'CNRS',
      url: 'https://lejournal.cnrs.fr/',
      rssUrl: 'https://lejournal.cnrs.fr/rss',
      type: 'institution',
      category: 'Établissement'
    }
  ]
};

export const getAllSources = () => {
  return [
    ...SOURCES.publishers,
    ...SOURCES.podcasts,
    ...SOURCES.institutions
  ];
};
