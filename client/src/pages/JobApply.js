import React, { useState } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Select, Box, Chip } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function JobApply({ keywords, maxResumes, maxSubmissions }) {
  const [companies, setCompanies] = useState([]);
  const [manualCompany, setManualCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const companyList = ['Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook', 'Tesla', 'Netflix', 'IBM', 'Oracle', 'Adobe'];

  const handleAddCompany = () => {
    if (manualCompany && !companies.includes(manualCompany) && companies.length < 10) {
      setCompanies([...companies, manualCompany]);
      setManualCompany('');
    }
  };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
        { companies, keywords },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log('Jobs Fetched:', data.jobs);
      setJobs(data.jobs);
    } catch (error) {
      console.error('Fetch Jobs Error:', error.response?.data || error.message);
    }
  };

  const handleDetectAndProceed = async () => {
    await fetchJobs();
    for (const job of jobs) {
      if (!job.applied) {
        if (!job.requiresDocs) {
          try {
            const { data } = await axios.post(
              `${process.env.REACT_APP_API_URL}/api/job/apply`,
              { jobId: job.id, company: job.company, title: job.title, link: job.link, requiresDocs: false },
              { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            setJobs(jobs.map(j => j.id === job.id ? { ...j, applied: true } : j));
            console.log('Applied to job:', job.id);
          } catch (error) {
            console.error('Apply Error:', error.response?.data || error.message);
          }
        } else {
          setSelectedJob(job);
          break;
        }
      }
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h5" gutterBottom>Select Companies (Up to 10)</Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Select
          multiple
          value={companies}
          onChange={(e) => setCompanies(e.target.value.slice(0, 10))}
          displayEmpty
          fullWidth
          sx={{ maxWidth: 300 }}
        >
          <MenuItem value="">Select from list</MenuItem>
          {companyList.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
        </Select>
        <TextField
          label="Or Enter Manually"
          value={manualCompany}
          onChange={(e) => setManualCompany(e.target.value)}
          sx={{ flexGrow: 1 }}
        />
        <Button variant="contained" onClick={handleAddCompany} disabled={companies.length >= 10}>
          Add
        </Button>
      </Box>
      <Box sx={{ mb: 3 }}>
        {companies.map((c, i) => (
          <Chip key={i} label={c} onDelete={() => setCompanies(companies.filter(comp => comp !== c))} sx={{ mr: 1 }} />
        ))}
      </Box>
      <Button variant="contained" onClick={handleDetectAndProceed} disabled={companies.length === 0}>
        DETECT & PROCEED
      </Button>
      {jobs.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Available Jobs</Typography>
          {jobs.map(job => (
            <Box key={job.id} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 2, borderRadius: 2 }}>
              <Typography>{job.title} - {job.company}</Typography>
              <Typography variant="body2"><a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a></Typography>
              <Button
                variant="contained"
                color={job.applied ? 'secondary' : 'primary'}
                onClick={() => job.requiresDocs ? setSelectedJob(job) : handleDetectAndProceed()}
                disabled={job.applied}
                sx={{ mt: 1 }}
              >
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