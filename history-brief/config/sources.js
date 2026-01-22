/**
 * Configuration des sources à scraper
 */

export const SOURCES = {
  publishers: [
    {
      name: 'Passés Composés',
      url: 'https://passes-composes.com/catalogue?nouveaute=true',
      type: 'publisher',
      monthsThreshold: 2 // Only books from last 2 months
    },
    {
      name: 'PUF',
      url: 'https://www.puf.com/disciplines/histoire-et-art',
      type: 'publisher',
      monthsThreshold: 2
    },
    {
      name: 'CNRS Éditions',
      url: 'https://www.cnrseditions.fr/discipline/histoire/',
      type: 'publisher',
      monthsThreshold: 2
    }
  ],
  podcasts: [
    {
      name: 'Storiavoce',
      url: 'https://storiavoce.com/',
      type: 'podcast',
      weeksThreshold: 2 // Only episodes from last 2 weeks
    },
    {
      name: 'OpCit',
      url: 'https://ihmc.ens.psl.eu/-opcit-podcast-ihmc-.html',
      type: 'podcast',
      weeksThreshold: 2
    },
    {
      name: 'Concordance des temps',
      url: 'https://www.radiofrance.fr/franceculture/podcasts/concordance-des-temps',
      rssUrl: 'https://radiofrance-podcast.net/podcast09/rss_10076.xml',
      type: 'podcast',
      weeksThreshold: 2
    },
    {
      name: 'Le cours de l\'histoire',
      url: 'https://www.radiofrance.fr/franceculture/podcasts/le-cours-de-l-histoire',
      rssUrl: 'https://radiofrance-podcast.net/podcast09/rss_10076.xml',
      type: 'podcast',
      weeksThreshold: 2
    }
  ]
};

export const getAllSources = () => {
  return [
    ...SOURCES.publishers,
    ...SOURCES.podcasts
  ];
};
