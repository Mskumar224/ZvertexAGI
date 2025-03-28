import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import axios from 'axios';

function Zgpt() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/zgpt/search`, { query });
      setResults(data.results);
      setError('');
    } catch (err) {
      console.error('Search failed:', err);
      setError(err.response?.data?.error || 'Search failed. Try again later.');
      setResults([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>Zgpt - Ask Anything</Typography>
      <Box sx={{ display: 'flex', mb: 4 }}>
        <TextField
          variant="outlined"
          placeholder="Ask Zgpt anything..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          fullWidth
          sx={{
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
          Search
        </Button>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {results.length > 0 && (
        <Box sx={{ p: 3, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ mb: 2 }}>Results</Typography>
          {results.map((result, index) => (
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
    </Container>
  );
}

export default Zgpt;