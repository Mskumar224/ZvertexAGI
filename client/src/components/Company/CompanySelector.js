import React, { useState, useContext } from 'react';
import { Autocomplete, TextField, Button, Box, Typography, CircularProgress, Alert, Fade } from '@mui/material';
import axios from 'axios';
import { ModalContext } from '../../App';

function CompanySelector({ technologies }) {
  const [companies, setCompanies] = useState([]);
  const [manualCompany, setManualCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { openModal } = useContext(ModalContext);

  const predefinedCompanies = [
    'Google', 'Microsoft', 'Amazon', 'Facebook', 'Apple', 'Tesla', 'Netflix', 'IBM', 'Oracle', 'Intel',
    'Cisco', 'Adobe', 'Salesforce', 'Uber', 'Lyft', 'Airbnb', 'Spotify', 'Dropbox', 'Slack', 'Zoom',
    'Twitter', 'LinkedIn', 'Pinterest', 'Snapchat', 'PayPal', 'Square', 'Shopify', 'Etsy', 'GitHub',
    'Atlassian', 'JPMorgan Chase', 'Goldman Sachs', 'Morgan Stanley', 'Bank of America', 'Walmart',
    'Target', 'Home Depot', 'Ford', 'General Motors', 'Boeing', 'Lockheed Martin', 'SpaceX', 'NVIDIA',
    'AMD', 'Qualcomm', 'Samsung', 'Sony', 'Dell', 'HP', 'Accenture',
  ];

  const handleAddCompany = async () => {
    if (manualCompany && !companies.includes(manualCompany)) {
      setLoading(true);
      try {
        const res = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/job/verify-company`,
          { company: manualCompany },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        if (res.data.valid) {
          setCompanies([...companies, manualCompany]);
          setManualCompany('');
          setError('');
        } else {
          setError('Company not found online. Please select a valid company.');
        }
      } catch (err) {
        setError('Failed to verify company');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleApply = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        { companies, technologies },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      openModal(
        <Box>
          <Typography variant="h6">Application Submitted!</Typography>
          <Typography>Successfully applied to {res.data.length} jobs! Check your email for confirmation.</Typography>
        </Box>
      );
    } catch (err) {
      setError('Failed to apply to jobs');
    }
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom>Select Companies</Typography>
        <Autocomplete
          multiple
          options={predefinedCompanies}
          value={companies}
          onChange={(e, newValue) => setCompanies(newValue)}
          freeSolo
          renderInput={(params) => <TextField {...params} label="Companies" />}
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <TextField label="Add Company" value={manualCompany} onChange={(e) => setManualCompany(e.target.value)} fullWidth />
          <Button variant="outlined" onClick={handleAddCompany} disabled={loading}>{loading ? <CircularProgress size={24} /> : 'Add'}</Button>
        </Box>
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        <Button variant="contained" onClick={handleApply} disabled={!companies.length || loading} sx={{ mt: 2 }}>Apply to Jobs</Button>
      </Box>
    </Fade>
  );
}

export default CompanySelector;