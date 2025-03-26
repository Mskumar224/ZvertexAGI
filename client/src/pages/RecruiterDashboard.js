import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';

function RecruiterDashboard() {
  const [keywords, setKeywords] = useState([]);
  return (
    <Container sx={{ py: 5, background: '#f5f5f5' }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 3 }}>Recruiter Dashboard</Typography>
      <Typography sx={{ mb: 3 }}>5 Resumes | 45 Submissions/Day</Typography>
      <ResumeUpload onResumeParsed={setKeywords} />
      {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={5} maxSubmissions={45} />}
      <JobTracker />
    </Container>
  );
}

export default RecruiterDashboard;