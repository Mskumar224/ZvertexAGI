import React from 'react';
import { Container, Typography, TextField, Button, FormControlLabel, Checkbox } from '@mui/material';
import axios from 'axios';

function JobApply() {
  const [technology, setTechnology] = React.useState('');
  const [companies, setCompanies] = React.useState({
    Indeed: false,
    LinkedIn: false,
    Glassdoor: false,
    Google: false,
    Amazon: false,
    Microsoft: false,
  });

  const handleCompanyChange = (event) => {
    setCompanies({ ...companies, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async () => {
    const selectedCompanies = Object.keys(companies).filter((key) => companies[key]);
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        { technology, companies: selectedCompanies },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Job preferences saved! Auto-apply will begin.');
    } catch (err) {
      console.error('Failed to save preferences:', err);
      alert('Failed to save preferences.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>
        Job Apply Settings
      </Typography>
      <TextField
        label="Technology"
        fullWidth
        value={technology}
        onChange={(e) => setTechnology(e.target.value)}
        sx={{ mb: 3 }}
        variant="outlined"
      />
      <Typography variant="h6" sx={{ mb: 2 }}>
        Select Companies
      </Typography>
      {Object.keys(companies).map((company) => (
        <FormControlLabel
          key={company}
          control={
            <Checkbox
              checked={companies[company]}
              onChange={handleCompanyChange}
              name={company}
            />
          }
          label={company}
        />
      ))}
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 3, py: 1.5 }}>
        Save Preferences
      </Button>
    </Container>
  );
}

export default JobApply;