import React, { useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Select } from '@mui/material';
import axios from 'axios';

function JobApply({ keywords }) {
  const [company, setCompany] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const companies = ['Google', 'Microsoft', 'Amazon', /* Add 47 more */];

  const handleCompanyDetect = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/detect-company`,
        { company: manualCompany || company },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (data.valid) {
        fetchJobs(data.company);
      } else {
        alert('Company not detected online!');
      }
    } catch (error) {
      alert('Detection failed!');
    }
  };

  const fetchJobs = async (companyName) => {
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
      { company: companyName, keywords },
      { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    );
    setJobs(data.jobs);
  };

  const handleApply = async (job) => {
    if (job.requiresDocs) {
      alert('Please upload additional documents or apply manually.');
      // Logic for document upload or redirect
    } else {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        { jobId: job.id },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Job applied successfully!');
    }
  };

  return (
    <Container>
      <Typography variant="h6">Select Company</Typography>
      <Select value={company} onChange={(e) => setCompany(e.target.value)}>
        {companies.map((c) => (
          <MenuItem key={c} value={c}>{c}</MenuItem>
        ))}
      </Select>
      <TextField
        label="Manual Company"
        value={manualCompany}
        onChange={(e) => setManualCompany(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button onClick={handleCompanyDetect}>Detect & Proceed</Button>
      {jobs.map((job) => (
        <div key={job.id}>
          <Typography>{job.title} - {job.company}</Typography>
          <Button onClick={() => handleApply(job)}>Apply</Button>
        </div>
      ))}
    </Container>
  );
}

export default JobApply;