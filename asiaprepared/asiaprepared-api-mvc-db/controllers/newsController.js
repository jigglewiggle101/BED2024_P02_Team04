const fetch = (...args) =>
    import('node-fetch').then(({ default: fetch }) => fetch(...args));
  
  const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
  
  const cache = new Map();
  const CACHE_TTL = 5 * 60 * 1000; // Cache time-to-live: 5 minutes
  
  const getTopHeadlines = async (req, res) => {
    const cacheKey = 'top-headlines';
    const now = Date.now();
  
    if (cache.has(cacheKey) && (now - cache.get(cacheKey).timestamp < CACHE_TTL)) {
      return res.json(cache.get(cacheKey).data);
    }
  
    const apiUrl = `https://gnews.io/api/v4/top-headlines?category=nation,business,technology,science,health&lang=en&country=sg,my,ph,bn,kh,id,la,mm,th,vn,id&max=10&apikey=${GNEWS_API_KEY}`;
  
    try {
      const response = await fetch(apiUrl);
  
      if (response.status === 429) { // 429 Too Many Requests
        throw new Error('Rate limit exceeded. Please try again later.');
      }
  
      if (!response.ok) {
        throw new Error(`Error fetching top headlines: ${response.statusText}`);
      }
  
      const data = await response.json();
      cache.set(cacheKey, { data, timestamp: now });
      res.json(data.articles);
    } catch (error) {
      console.error('Error fetching news:', error);
      res.status(500).json({ error: 'Failed to fetch news. ' + error.message });
    }
  };
  
  
  const searchNews = async (req, res) => {
    const query = req.query.q || 'southeast asia';
    const apiUrl = `https://gnews.io/api/v4/search?q=${query}&lang=en&country=sg,my,ph,bn,kh,id,la,mm,th,vn,id&max=10&apikey=${GNEWS_API_KEY}`;
  
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Error fetching search news: ${response.statusText}`);
      }
      const data = await response.json();
      res.json(data.articles);
    } catch (error) {
      console.error('Error fetching general news:', error);
      res.status(500).json({ error: 'Failed to fetch general news' });
    }
  };
  
  module.exports = {
    getTopHeadlines,
    searchNews,
  };
  