const fetchSingapore = async () => {
  const newsObject = fetch(
    `https://newsapi.org/v2/top-headlines?country=sg&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
  ).then((res) => res.json());
  return { singapore: newsObject.articles };
};

const fetchCategory = async (category) => {
  const newsObject = fetch(
    `https://newsapi.org/v2/top-headlines?category=${category}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`
  ).then((res) => res.json());
  return { category: newsObject.articles };
};

export const fetchNews = async () => {
  const categories = [
    "business",
    "entertainment",
    "general",
    "health",
    "science",
    "sports",
    "technology",
  ];
  const news = [];

  const categorySingapore = await fetchSingapore();
  news.push(categorySingapore);

  categories.forEach(async (category) => {
    const categoryNews = await fetchCategory(category);
    news.push(categoryNews);
  });

  console.log(news);
};
