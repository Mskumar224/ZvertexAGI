import React, { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';

function StudentDashboard() {
  const [keywords, setKeywords] = useState([]);

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>Student Dashboard</Typography>
      <Typography sx={{ mb: 3 }}>Max 1 Resume | 45 Submissions/Day</Typography>
      <ResumeUpload onResumeParsed={setKeywords} />
      {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={1} maxSubmissions={45} />}
      <JobTracker />
    </Container>
  );
}

export default StudentDashboard;