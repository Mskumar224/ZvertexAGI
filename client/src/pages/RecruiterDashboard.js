import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from '../JobApply';
import JobTracker from '../components/JobTracker';

function RecruiterDashboard() {
  const [keywords, setKeywords] = useState([]);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>Recruiter Dashboard</Typography>
      <Typography sx={{ mb: 3 }}>Max 5 Resumes | 45 Submissions/Day</Typography>
      <ResumeUpload onResumeParsed={setKeywords} />
      {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={5} maxSubmissions={45} />}
      <JobTracker />
    </Container>
  );
}

export default RecruiterDashboard;