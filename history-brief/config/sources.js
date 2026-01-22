/**
 * Configuration des sources à scraper
 */

export const SOURCES = {
  publishers: [
    {
      name: 'Passés Composés',
      url: 'https://passes-composes.com/catalogue?nouveaute=true',
      type: 'publisher',
      monthsThreshold: 6 // Only books from last 6 months
    },
    {
      name: 'PUF',
      url: 'https://www.puf.com/disciplines/histoire-et-art',
      type: 'publisher',
      monthsThreshold: 6
    },
    {
      name: 'CNRS Éditions',
      url: 'https://www.cnrseditions.fr/discipline/histoire/',
      type: 'publisher',
      monthsThreshold: 6
    }
  ],
  podcasts: [
    {
      name: 'Storiavoce',
      url: 'https://storiavoce.com/',
      type: 'podcast',
      monthsThreshold: 1 // Only episodes from last month
    },
    {
      name: 'OpCit',
      url: 'https://ihmc.ens.psl.eu/-opcit-podcast-ihmc-.html',
      type: 'podcast',
      monthsThreshold: 1
    },
    {
      name: 'Concordance des temps',
      url: 'https://www.radiofrance.fr/franceculture/podcasts/concordance-des-temps',
      rssUrl: 'https://radiofrance-podcast.net/podcast09/rss_10076.xml',
      type: 'podcast',
      monthsThreshold: 1
    },
    {
      name: 'Le cours de l\'histoire',
      url: 'https://www.radiofrance.fr/franceculture/podcasts/le-cours-de-l-histoire',
      rssUrl: 'https://radiofrance-podcast.net/podcast09/rss_10076.xml',
      type: 'podcast',
      monthsThreshold: 1
    }
  ]
};

export const getAllSources = () => {
  return [
    ...SOURCES.publishers,
    ...SOURCES.podcasts
  ];
};
