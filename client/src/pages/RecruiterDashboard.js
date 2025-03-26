import React, { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function RecruiterDashboard() {
  const [keywords, setKeywords] = useState([]);
  const history = useHistory();

  return (
    <Container sx={{ py: 5, background: '#f5f5f5' }}>
      <Button
        onClick={() => history.push('/subscription')}
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3, background: '#1976d2', color: '#fff', '&:hover': { background: '#115293', transform: 'scale(1.05)' }, transition: 'all 0.3s' }}
      >
        Back to Subscription
      </Button>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 3 }}>Recruiter Dashboard</Typography>
      <Typography sx={{ mb: 3 }}>Free Plan: 5 Resumes | 45 Submissions/Day</Typography>
      <ResumeUpload onResumeParsed={setKeywords} maxResumes={5} />
      {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={5} maxSubmissions={45} />}
      <JobTracker />
    </Container>
  );
}

export default RecruiterDashboard;