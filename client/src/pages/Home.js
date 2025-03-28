import React, { useState } from 'react';
import { Container, Typography, Button, Box, Grid, TextField, Card, CardContent, CardActions, useMediaQuery } from '@mui/material';
import axios from 'axios';

function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem('token');
  const isMobile = useMediaQuery('(max-width:600px)');

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
    if (e.key === 'Enter') handleSearch();
  };

  const handleDashboardClick = (path) => {
    if (token) {
      window.location.href = path;
    } else {
      window.location.href = '/signup';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant={isMobile ? 'h4' : 'h2'} 
          sx={{ color: '#1976d2', fontWeight: 700, mb: 2, cursor: 'pointer' }} 
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI
        </Typography>
        <Typography variant={isMobile ? 'h6' : 'h5'} sx={{ color: '#6B7280', mb: 4 }}>
          Automate Your Job Search with Cutting-Edge AI
        </Typography>
        <Button variant="contained" color="primary" size="large" onClick={() => window.location.href = '/signup'}>
          Get Started
        </Button>
      </Box>

      <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: isMobile ? 'column' : 'row' }}>
        <TextField
          variant="outlined"
          placeholder="Ask ZGpt anything..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          sx={{
            width: isMobile ? '100%' : '50%',
            background: '#fff',
            borderRadius: '25px 25px 25px 25px',
            mb: isMobile ? 2 : 0,
            '& .MuiOutlinedInput-root': {
              borderRadius: '25px',
              '& fieldset': { borderColor: '#1976d2' },
              '&:hover fieldset': { borderColor: '#115293' },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          sx={{
            borderRadius: '25px',
            background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
            color: '#fff',
            fontWeight: 'bold',
            padding: '10px 20px',
            '&:hover': { background: 'linear-gradient(45deg, #115293, #1976d2)' },
          }}
        >
          ZGpt
        </Button>
      </Box>

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
        {[
          { title: 'For Students', desc: 'Land your dream job', path: '/student-dashboard' },
          { title: 'For Recruiters', desc: 'Manage 5 profiles', path: '/recruiter-dashboard' },
          { title: 'For Businesses', desc: 'Scale with 3 recruiters', path: '/business-dashboard' },
        ].map((item) => (
          <Grid item xs={12} md={4} key={item.title}>
            <Card 
              sx={{ cursor: 'pointer', '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.2)' } }} 
              onClick={() => handleDashboardClick(item.path)}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>{item.title}</Typography>
                <Typography sx={{ color: '#6B7280' }}>{item.desc}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">Go to Dashboard</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Home;