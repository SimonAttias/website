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
      url: 'https://open.spotify.com/show/3q09jBiYIJ1NGnAMYuDQeH',
      type: 'podcast',
      weeksThreshold: 2 // Only episodes from last 2 weeks
    },
    {
      name: 'OpCit',
      url: 'https://open.spotify.com/show/4qyZY8ieJvMKj9tLUoLM7l',
      type: 'podcast',
      weeksThreshold: 2
    },
    {
      name: 'Concordance des temps',
      url: 'https://www.radiofrance.fr/franceculture/podcasts/concordance-des-temps',
      type: 'podcast',
      weeksThreshold: 2
    },
    {
      name: 'Le cours de l\'histoire',
      url: 'https://www.radiofrance.fr/franceculture/podcasts/le-cours-de-l-histoire',
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
