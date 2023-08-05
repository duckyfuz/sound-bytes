const fetchSingapore = async () => {
  const newsObject = await fetch(
    `https://newsapi.org/v2/top-headlines?country=sg&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
  ).then(res => res.json());
  return newsObject.articles;
};

const fetchCategory = async category => {
  const newsObject = await fetch(
    `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
  ).then(res => res.json());
  return newsObject.articles;
};

export const fetchNews = async () => {
  const categories = [
    'business',
    'entertainment',
    'general',
    'health',
    'science',
    'sports',
    'technology',
  ];
  const newsObject = {};

  const categorySingapore = await fetchSingapore();
  newsObject['singapore'] = categorySingapore;

  categories.forEach(async category => {
    const categoryNews = await fetchCategory(category);
    newsObject[`${category}`] = categoryNews;
  });

  return newsObject;
};
