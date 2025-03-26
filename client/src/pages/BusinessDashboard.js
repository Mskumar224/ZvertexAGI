import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';

function BusinessDashboard() {
  const [keywords, setKeywords] = useState([]);
  return (
    <Container sx={{ py: 5, background: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 3 }}>Business Dashboard</Typography>
      <Typography sx={{ mb: 3 }}>Free Plan: 3 Resumes | 145 Submissions/Day</Typography>
      <ResumeUpload onResumeParsed={setKeywords} maxResumes={3} />
      {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={3} maxSubmissions={145} />}
      <JobTracker />
    </Container>
  );
}

export default BusinessDashboard;