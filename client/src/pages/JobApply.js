import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, Box, Checkbox, ListItemText, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function JobApply({ keywords, maxResumes, maxSubmissions }) {
  const [selectedTech, setSelectedTech] = useState('');
  const [manualTech, setManualTech] = useState('');
  const [companies, setCompanies] = useState([]);
  const [manualCompany, setManualCompany] = useState('');
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [error, setError] = useState('');

  const techOptions = [
    'JavaScript', 'Python', 'React', 'Node.js', 'Java', 'SQL', 'AWS', 'Docker', 'TypeScript', 'Kotlin',
    'C#', 'Ruby', 'PHP', 'Go', 'Swift', 'Rust', 'Scala', 'Perl', 'Haskell', 'Lua',
    'C++', 'C', 'Objective-C', 'R', 'MATLAB', 'Groovy', 'Dart', 'Elixir', 'F#', 'Erlang',
    'Vue.js', 'Angular', 'Svelte', 'Ember.js', 'Backbone.js', 'Django', 'Flask', 'Spring', 'Rails', 'Laravel',
    'Express.js', 'FastAPI', 'NestJS', 'GraphQL', 'REST', 'gRPC', 'SOAP', 'MongoDB', 'PostgreSQL', 'MySQL',
    'SQLite', 'Redis', 'Cassandra', 'Elasticsearch', 'Firebase', 'DynamoDB', 'Oracle', 'MariaDB', 'CouchDB', 'Neo4j',
    'Kubernetes', 'Terraform', 'Ansible', 'Chef', 'Puppet', 'Jenkins', 'GitHub Actions', 'CircleCI', 'Travis CI', 'GitLab CI',
    'Azure', 'GCP', 'Heroku', 'DigitalOcean', 'Linode', 'Vercel', 'Netlify', 'Snowflake', 'Redshift', 'BigQuery',
    'Pandas', 'NumPy', 'TensorFlow', 'PyTorch', 'Keras', 'Scikit-learn', 'Spark', 'Hadoop', 'Kafka', 'RabbitMQ',
    'Jupyter', 'Tableau', 'Power BI', 'Looker', 'Qlik', 'D3.js', 'Three.js', 'WebGL', 'OpenGL', 'Unity',
    'Unreal Engine', 'Blockchain', 'Solidity', 'Web3.js', 'Ethereum'
  ];

  const companyOptions = [
    'HubSpot', 'Zoho', 'Okta', 'PagerDuty', 'Twilio', 'Asana', 'Zapier', 'Freshworks', 'Pipedrive', 'GitLab',
    'Atlassian', 'ServiceNow', 'Splunk', 'Datadog', 'New Relic', 'monday.com', 'Trello', 'Wrike', 'ClickUp', 'Basecamp',
    'Smartsheet', 'Domo', 'Tableau', 'Looker', 'Sisense', 'Qualtrics', 'SurveyMonkey', 'Zendesk', 'Intercom', 'Drift',
    'Mailchimp', 'SendGrid', 'Constant Contact', 'ActiveCampaign', 'Campaign Monitor', 'Hootsuite', 'Sprout Social',
    'Buffer', 'Canva', 'Figma', 'InVision', 'Sketch', 'Lucidchart', 'Miro', 'Airtable', 'Notion', 'Coda', 'Quip'
  ];

  const handleCompanyChange = (event) => {
    const value = event.target.value;
    if (value.length <= 15) setCompanies(value);
    else setError('Maximum 15 companies allowed');
  };

  const verifyCompanies = async () => {
    const allCompanies = [...companies, ...(manualCompany ? [manualCompany] : [])];
    if (allCompanies.length === 0) return setError('Select at least one company');
    if (allCompanies.length > 15) return setError('Maximum 15 companies allowed');
    const techToUse = manualTech || selectedTech;
    if (!techToUse) return setError('Select or enter a technology');

    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/job/verify-companies`, { companies: allCompanies });
      const validCompanies = data.companies.filter(c => c.valid).map(c => c.name);
      if (validCompanies.length === 0) return setError('No valid companies detected');
      setCompanies(validCompanies);
      fetchJobs(validCompanies, techToUse);
    } catch (err) {
      setError('Company verification failed');
    }
  };

  const fetchJobs = async (validCompanies, tech) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/job/fetch-jobs`,
        { companies: validCompanies, technology: tech },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setJobs(data.jobs);
      setError('');

      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/update-selection`,
        { companies: validCompanies, technology: tech },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
    } catch (err) {
      setError('Failed to fetch jobs');
    }
  };

  const handleApply = async (job) => {
    if (job.applied) return alert('Already applied to this job!');
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
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6">Detected Tech: {keywords.join(', ')}</Typography>
        <FormControl sx={{ minWidth: 200, mb: 2 }}>
          <InputLabel>Select Technology</InputLabel>
          <Select
            value={selectedTech}
            onChange={(e) => setSelectedTech(e.target.value)}
            label="Select Technology"
          >
            {keywords.map(tech => <MenuItem key={tech} value={tech}>{tech}</MenuItem>)}
            <MenuItem value="">Other</MenuItem>
            {techOptions.map(tech => <MenuItem key={tech} value={tech}>{tech}</MenuItem>)}
          </Select>
        </FormControl>
        {!selectedTech && (
          <TextField
            label="Or Enter Technology Manually"
            value={manualTech}
            onChange={(e) => setManualTech(e.target.value)}
            sx={{ ml: 2, minWidth: 200 }}
          />
        )}
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
        <Button variant="contained" onClick={verifyCompanies} sx={{ background: '#1976d2' }}>
          Fetch Jobs
        </Button>
      </Box>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {jobs.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>Available Jobs (Auto-Apply every 30 mins)</Typography>
          {jobs.map(job => (
            <Box key={job.id} sx={{ p: 2, border: '1px solid #e0e0e0', mb: 2, borderRadius: 1 }}>
              <Typography>{job.title}</Typography>
              <Typography variant="body2"><a href={job.link} target="_blank" rel="noopener noreferrer">{job.link}</a></Typography>
              <Button
                variant="contained"
                onClick={() => handleApply(job)}
                disabled={job.applied}
                sx={{ mt: 1, background: job.applied ? '#e0e0e0' : '#1976d2', color: job.applied ? '#000' : '#fff' }}
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