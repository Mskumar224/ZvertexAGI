import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, Box, TextField, useMediaQuery } from '@mui/material';
import axios from 'axios';

function JobApply() {
  const [technology, setTechnology] = useState('');
  const [customTech, setCustomTech] = useState('');
  const [companies, setCompanies] = useState({
    Indeed: false,
    LinkedIn: false,
    Glassdoor: false,
    Monster: false,
    CareerBuilder: false,
  });
  const [profiles, setProfiles] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState('');
  const isMobile = useMediaQuery('(max-width:600px)');

  const techOptions = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'PHP', 'TypeScript', 
    'React', 'Node.js', 'SQL', 'AWS', 'Angular', 'Vue.js', 'Django', 'Flask', 
    'Spring', 'Kotlin', 'Swift', 'Rust', 'Scala', 'Perl', 'MATLAB', 'R'
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfiles(data.profiles || []);
        setTechnology(data.selectedTechnology || '');
        setSelectedProfile(data.selectedProfile || '');
        setCompanies(prev => ({
          ...prev,
          ...Object.fromEntries(data.selectedCompanies.map(c => [c, true])),
        }));
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleCompanyChange = (event) => {
    setCompanies({ ...companies, [event.target.name]: event.target.checked });
  };

  const handleSubmit = async () => {
    const selectedCompanies = Object.keys(companies).filter((key) => companies[key]);
    const finalTech = technology === 'Other' ? customTech : technology;
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!finalTech || selectedCompanies.length === 0) {
      alert('Please select a technology and at least one company');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        { technology: finalTech, companies: selectedCompanies, profileId: selectedProfile },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Preferences saved! Auto-apply will begin.');
    } catch (err) {
      console.error('Failed to save preferences:', err);
      alert('Failed to save preferences: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography 
        variant={isMobile ? "h5" : "h4"} 
        sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
        onClick={() => window.location.href = '/'}
      >
        ZvertexAI - Job Apply Settings
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Technology</InputLabel>
          <Select
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            label="Technology"
          >
            {techOptions.map((tech) => (
              <MenuItem key={tech} value={tech}>{tech}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {technology === 'Other' && (
          <TextField
            label="Custom Technology"
            fullWidth
            value={customTech}
            onChange={(e) => setCustomTech(e.target.value)}
            variant="outlined"
          />
        )}
        {profiles.length > 0 && (
          <FormControl fullWidth>
            <InputLabel>Select Profile</InputLabel>
            <Select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value)}
              label="Select Profile"
            >
              {profiles.map((profile) => (
                <MenuItem key={profile._id} value={profile._id}>
                  {profile.filename} ({profile.extractedTech})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <Typography variant="h6">Select Companies</Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
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
        </Box>
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ py: 1.5 }}>
          Save Preferences
        </Button>
      </Box>
    </Container>
  );
}

export default JobApply;