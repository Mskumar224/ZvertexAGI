import React, { useState } from 'react';
import { Container, Typography, TextField, Button, FormControlLabel, Checkbox, Box, Radio, RadioGroup, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import axios from 'axios';

function JobApply() {
  const [technology, setTechnology] = useState('');
  const [customTechnology, setCustomTechnology] = useState('');
  const [companies, setCompanies] = useState({
    Indeed: false,
    LinkedIn: false,
    Glassdoor: false,
    Google: false,
    Amazon: false,
    Microsoft: false,
  });
  const [autoApplyType, setAutoApplyType] = useState('basic');
  const [profileDetails, setProfileDetails] = useState({
    fullName: '',
    address: '',
    experience: '',
    education: '',
    skills: '',
    additionalInfo: '',
  });
  const [error, setError] = useState('');

  const technologies = [
    'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'PHP', 'Go', 'Swift', 'Kotlin', 'TypeScript', 'Other'
  ];

  const handleCompanyChange = (event) => {
    setCompanies({ ...companies, [event.target.name]: event.target.checked });
  };

  const handleProfileChange = (e) => {
    setProfileDetails({ ...profileDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const selectedCompanies = Object.keys(companies).filter((key) => companies[key]);
    const finalTechnology = technology === 'Other' ? customTechnology : technology;

    if (!finalTechnology || selectedCompanies.length === 0) {
      setError('Please select a technology and at least one company');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        {
          technology: finalTechnology,
          companies: selectedCompanies,
          autoApplyType,
          profileDetails: autoApplyType === 'full' ? {
            ...profileDetails,
            skills: profileDetails.skills.split(',').map(s => s.trim()),
          } : null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError('');
      alert('Job preferences saved! Auto-apply will begin.');
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setError(err.response?.data?.message || 'Failed to save preferences');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>Job Apply Settings</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Technology</InputLabel>
        <Select
          value={technology}
          onChange={(e) => setTechnology(e.target.value)}
          label="Technology"
        >
          {technologies.map((tech) => (
            <MenuItem key={tech} value={tech}>{tech}</MenuItem>
          ))}
        </Select>
      </FormControl>
      {technology === 'Other' && (
        <TextField
          label="Custom Technology"
          fullWidth
          value={customTechnology}
          onChange={(e) => setCustomTechnology(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
        />
      )}
      <Typography variant="h6" sx={{ mb: 2 }}>Select Companies</Typography>
      {Object.keys(companies).map((company) => (
        <FormControlLabel
          key={company}
          control={<Checkbox checked={companies[company]} onChange={handleCompanyChange} name={company} />}
          label={company}
        />
      ))}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6">Auto-Apply Type</Typography>
        <RadioGroup value={autoApplyType} onChange={(e) => setAutoApplyType(e.target.value)}>
          <FormControlLabel value="basic" control={<Radio />} label="Basic Apply (Name, Email)" />
          <FormControlLabel value="full" control={<Radio />} label="Full Profile Apply" />
        </RadioGroup>
      </Box>
      {autoApplyType === 'full' && (
        <Box sx={{ mt: 3 }}>
          <TextField label="Full Name" name="fullName" fullWidth value={profileDetails.fullName} onChange={handleProfileChange} sx={{ mb: 2 }} />
          <TextField label="Address" name="address" fullWidth value={profileDetails.address} onChange={handleProfileChange} sx={{ mb: 2 }} />
          <TextField label="Experience" name="experience" fullWidth value={profileDetails.experience} onChange={handleProfileChange} sx={{ mb: 2 }} />
          <TextField label="Education" name="education" fullWidth value={profileDetails.education} onChange={handleProfileChange} sx={{ mb: 2 }} />
          <TextField label="Skills (comma-separated)" name="skills" fullWidth value={profileDetails.skills} onChange={handleProfileChange} sx={{ mb: 2 }} />
          <TextField label="Additional Info" name="additionalInfo" fullWidth value={profileDetails.additionalInfo} onChange={handleProfileChange} sx={{ mb: 2 }} />
        </Box>
      )}
      <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ mt: 3, py: 1.5 }}>
        Save Preferences
      </Button>
    </Container>
  );
}

export default JobApply;