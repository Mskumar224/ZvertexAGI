import React, { useState } from 'react';
import { Container, Typography, Button, Box, Grid, TextField } from '@mui/material';
import axios from 'axios';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/zgpt/search`, { query: searchQuery });
      setSearchResults(data.results);
    } catch (err) {
      console.error('Search failed:', err);
      setSearchResults([{ title: 'Error', content: 'Failed to fetch results. Try again later.' }]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h2" sx={{ color: '#1976d2', fontWeight: 700, mb: 2 }}>
          Welcome to ZvertexAGI
        </Typography>
        <Typography variant="h5" sx={{ color: '#6B7280', mb: 4 }}>
          Automate Your Job Search with Cutting-Edge AI Technology
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => window.location.href = '/signup'}>
          Get Started
        </Button>
      </Box>

      {/* Zgpt Search Bar */}
      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Ask Zgpt anything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            width: '50%',
            background: '#fff',
            borderRadius: '25px 0 0 25px',
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px 0 0 25px',
              '& fieldset': { borderColor: '#1976d2' },
              '&:hover fieldset': { borderColor: '#115293' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            borderRadius: '0 25px 25px 0',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px 20px',
            '&:hover': { background: 'linear-gradient(45deg, #115293, #1976d2)' },
          }}
        >
          Zgpt
        </Button>
      </Box>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <Box sx={{ mb: 6, p: 3, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Search Results</Typography>
          {searchResults.map((result, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ color: '#1976d2' }}>{result.title}</Typography>
              <Typography sx={{ color: '#6B7280' }}>{result.content}</Typography>
              {result.link && (
                <Typography variant="body2">
                  <a href={result.link} target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2' }}>
                    {result.link}
                  </a>
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>For Students</Typography>
            <Typography sx={{ color: '#6B7280' }}>Land your dream job with automated applications.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>For Recruiters</Typography>
            <Typography sx={{ color: '#6B7280' }}>Manage multiple profiles effortlessly.</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>For Businesses</Typography>
            <Typography sx={{ color: '#6B7280' }}>Scale hiring with powerful tools.</Typography>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;