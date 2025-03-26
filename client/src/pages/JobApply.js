import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, Box } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function JobApply({ keywords, maxResumes, maxSubmissions }) {
  const [company, setCompany] = useState('');
  const [manualCompany, setManualCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState('');

  const companies = [
    'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Tesla', 'IBM', 'Oracle', 'Intel', 'Cisco',
    'Adobe', 'Salesforce', 'Netflix', 'Spotify', 'Uber', 'Lyft', 'Airbnb', 'Dropbox', 'Slack', 'Zoom',
    'Twitter', 'LinkedIn', 'PayPal', 'Square', 'Stripe', 'Shopify', 'Etsy', 'Pinterest', 'Reddit', 'Snapchat',
    'TikTok', 'Twitch', 'Discord', 'Robinhood', 'Coinbase', 'Goldman Sachs', 'JPMorgan', 'Morgan Stanley',
    'Bank of America', 'Walmart', 'Target', 'Home Depot', 'Boeing', 'Lockheed Martin', 'SpaceX', 'General Motors',
    'Ford', 'Toyota', 'Samsung'
  ];

  const verifyCompany = async (companyName) => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/verify-company`, { company: companyName });
      if (data.valid) {
        fetchJobs(companyName);
      } else {
        setError('Company not detected online. Please select a valid company.');
      }
    } catch (err) {
      setError('Company verification failed.');
    }
  };

  const fetchJobs = async (companyName) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
        { company: companyName, keywords },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setJobs(data.jobs);
      setError('');
    } catch (err) {
      setError('Failed to fetch jobs.');
    }
  };

  const handleApply = async (job) => {
    if (job.requiresDocs) {
      setSelectedJob(job);
    } else {
      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/job/apply`,
          { jobId: job.id, company: job.company, title: job.title, link: job.link, requiresDocs: job.requiresDocs },
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        setJobs(jobs.map(j => j.id === job.id ? { ...j, applied: true } : j));
        alert(data.message);
      } catch (err) {
        setError(err.response?.data?.error || 'Application failed');
      }
    }
  };

  return (
    <Container sx={{ py: 5, background: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>Apply to Jobs</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Select value={company} onChange={(e) => setCompany(e.target.value)} displayEmpty sx={{ minWidth: 200 }}>
          <MenuItem value="">Select Company</MenuItem>
          {companies.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
        <TextField label="Or Enter Manually" value={manualCompany} onChange={(e) => setManualCompany(e.target.value)} sx={{ flexGrow: 1 }} />
        <Button variant="contained" onClick={() => verifyCompany(manualCompany || company)}>Fetch Jobs</Button>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {jobs.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Available Jobs</Typography>
          {jobs.map(job => (
            <Box key={job.id} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 2, borderRadius: 1 }}>
              <Typography>{job.title}</Typography>
              <Typography variant="body2"><a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a></Typography>
              <Button variant="contained" onClick={() => handleApply(job)} disabled={job.applied} sx={{ mt: 1 }}>
                {job.applied ? 'Applied' : 'Apply Now'}
              </Button>
            </Box>
          ))}
        </Box>
      )}
      {selectedJob && <DocumentUpload job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </Container>
  );
}

export default JobApply;