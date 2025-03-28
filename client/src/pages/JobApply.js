import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, Box, Checkbox, ListItemText } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function JobApply({ keywords, maxResumes, maxSubmissions, profileId }) {
  const [selectedTech, setSelectedTech] = useState('');
  const [manualTech, setManualTech] = useState('');
  const [companies, setCompanies] = useState([]);
  const [manualCompany, setManualCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState('');

  const techOptions = {
    'Frontend': ['React', 'Angular', 'Vue.js', 'TypeScript', 'JavaScript'],
    'Backend': ['Node.js', 'Python', 'Java', 'Ruby', 'PHP', 'Go', 'C#'],
    'DevOps': ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Jenkins'],
    'Mobile': ['Swift', 'Kotlin', 'Flutter', 'React Native'],
    'Data': ['SQL', 'NoSQL', 'R', 'MATLAB', 'Pandas'],
    'Other': ['Rust', 'Scala', 'Perl', 'Haskell'],
  };

  const companyOptions = [
    'Indeed', 'LinkedIn', 'Glassdoor', 'Monster', 'SimplyHired', 'CareerBuilder', 'ZipRecruiter', 'Snagajob', 'Hired', 'Dice',
    'AngelList', 'Stack Overflow Jobs', 'GitHub Jobs', 'Remote.co', 'We Work Remotely'
  ];

  const handleCompanyChange = (event) => {
    const value = event.target.value;
    if (value.length <= 15) setCompanies(value);
    else setError('Maximum 15 companies allowed');
  };

  const verifyAndFetchJobs = async () => {
    const allCompanies = [...companies, ...(manualCompany ? [manualCompany] : [])];
    if (allCompanies.length === 0) return setError('Select at least one company');
    if (allCompanies.length > 15) return setError('Maximum 15 companies allowed');
    const techToUse = manualTech || selectedTech || keywords[0];
    if (!techToUse) return setError('Select or enter a technology');

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/verify-companies`, { companies: allCompanies });
      const validCompanies = data.companies.filter(c => c.valid).map(c => c.name);
      if (validCompanies.length === 0) return setError('No valid companies detected');
      setCompanies(validCompanies);

      const { data: jobData } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
        { companies: validCompanies, technology: techToUse },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setJobs(jobData.jobs);
      setError('');

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/update-selection`,
        { companies: validCompanies, technology: techToUse },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );

      for (const job of jobData.jobs) {
        if (!job.applied) {
          await handleApply(job);
        }
      }
    } catch (err) {
      setError('Failed to fetch or apply to jobs');
    }
  };

  const handleApply = async (job) => {
    if (job.applied) return;
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/apply`,
        { jobId: job.id, company: job.company, title: job.title, link: job.link, requiresDocs: job.requiresDocs, profileId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setJobs(jobs.map(j => j.id === job.id ? { ...j, applied: true } : j));
    } catch (err) {
      setError(err.response?.data?.error || 'Application failed');
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Box sx={{ p: 3, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Apply to Jobs (Auto-Apply Every 30 Mins)</Typography>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Select or Enter Technology</Typography>
          <Select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            displayEmpty
            sx={{ minWidth: 200, mb: 2 }}
          >
            <MenuItem value="">Choose Technology</MenuItem>
            {Object.entries(techOptions).map(([category, techs]) => [
              <MenuItem disabled key={category}><strong>{category}</strong></MenuItem>,
              ...techs.map(tech => <MenuItem key={tech} value={tech}>{tech}</MenuItem>)
            ])}
          </Select>
          <TextField
            label="Or Enter Technology Manually"
            value={manualTech}
            onChange={(e) => setManualTech(e.target.value)}
            sx={{ ml: 2, minWidth: 200 }}
          />
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6">Select Companies (Up to 15)</Typography>
          <Select
            multiple
            value={companies}
            onChange={handleCompanyChange}
            renderValue={(selected) => selected.join(', ')}
            sx={{ minWidth: 300, mb: 2 }}
          >
            {companyOptions.map(company => (
              <MenuItem key={company} value={company}>
                <Checkbox checked={companies.indexOf(company) > -1} />
                <ListItemText primary={company} />
              </MenuItem>
            ))}
          </Select>
          <TextField
            label="Add Manual Company"
            value={manualCompany}
            onChange={(e) => setManualCompany(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" color="primary" onClick={verifyAndFetchJobs}>
            Start Auto-Apply
          </Button>
        </Box>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
        {jobs.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>Jobs (Auto-Applying)</Typography>
            {jobs.map(job => (
              <Box key={job.id} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 2, borderRadius: 1 }}>
                <Typography>{job.title}</Typography>
                <Typography variant="body2"><a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a></Typography>
                <Typography>{job.applied ? 'Applied' : 'Applying...'}</Typography>
              </Box>
            ))}
          </Box>
        )}
        {selectedJob && <DocumentUpload job={selectedJob} onClose={() => setSelectedJob(null)} />}
      </Box>
    </Container>
  );
}

export default JobApply;