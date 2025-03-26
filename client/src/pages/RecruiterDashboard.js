import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';

function RecruiterDashboard() {
  const [keywords, setKeywords] = useState([]);
  const [userData, setUserData] = useState({});
  const history = useHistory();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(data);
    };
    fetchUserData();
  }, []);

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
      <Box sx={{ mb: 3, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, background: '#fff' }}>
        <Typography variant="h6">User Profile</Typography>
        <Typography>Name: {userData.name || 'Not Set'}</Typography>
        <Typography>Email: {userData.email}</Typography>
        <Typography>Phone: {userData.phone || 'Not Set'}</Typography>
        <Typography>Selected Companies: {userData.selectedCompanies?.join(', ') || 'None'}</Typography>
        <Typography>Selected Technology: {userData.selectedTechnology || 'None'}</Typography>
        <Typography>Jobs Applied: {userData.jobsApplied?.length || 0}</Typography>
      </Box>
      <ResumeUpload onResumeParsed={setKeywords} maxResumes={5} />
      {keywords.length > 0 && <JobApply keywords={keywords} maxResumes={5} maxSubmissions={45} />}
      <JobTracker />
    </Container>
  );
}

export default RecruiterDashboard;