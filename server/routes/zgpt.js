const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ message: 'Query is required' });

  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: { q: query, api_key: process.env.SERPAPI_KEY || 'mock_key' },
    });

    const results = response.data.organic_results?.slice(0, 3).map(result => ({
      title: result.title,
      content: result.snippet,
      link: result.link,
    })) || [
      { title: `${query} Overview`, content: `This is a brief overview about ${query}.`, link: `https://example.com/${query.toLowerCase().replace(/\s+/g, '-')}` },
    ];

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

module.exports = router;