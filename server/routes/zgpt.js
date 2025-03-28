const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    // Mock search results (replace with real API like SerpAPI when available)
    const mockResults = [
      { 
        title: `${query} Overview`, 
        content: `This is a brief overview about ${query}. It provides key insights and information relevant to your search.`, 
        link: `https://example.com/${query.toLowerCase().replace(/\s+/g, '-')}` 
      },
      { 
        title: `Latest on ${query}`, 
        content: `Explore the most recent updates and trends related to ${query}. Stay informed with fresh content.`, 
        link: `https://example.com/${query.toLowerCase().replace(/\s+/g, '-')}/latest` 
      },
      { 
        title: `${query} Resources`, 
        content: `Find useful resources and tools for ${query} to enhance your knowledge or skills.`, 
        link: `https://example.com/${query.toLowerCase().replace(/\s+/g, '-')}/resources` 
      },
    ];

    // Optional: Integrate SerpAPI (requires API key)
    /*
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        api_key: process.env.SERPAPI_KEY,
      },
    });
    const results = response.data.organic_results.map(result => ({
      title: result.title,
      content: result.snippet,
      link: result.link,
    }));
    res.json({ results });
    */

    res.json({ results: mockResults });
  } catch (error) {
    res.status(500).json({ error: 'Search failed', details: error.message });
  }
});

module.exports = router;