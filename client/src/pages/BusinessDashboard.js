// Location: C:\Users\satee\OneDrive\Desktop\ZvertexAGI\ZvertexAGI\client\src\pages\BusinessDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ProfileUpload from '../components/ProfileUpload';
import ResumeUpload from '../components/ResumeUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';
import axios from 'axios';
import BackButton from '../components/BackButton';

function BusinessDashboard() {
  const [recruiters, setRecruiters] = useState([{}, {}, {}]);
  const [user, setUser] = useState(null);
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/export-dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'business_dashboard.xlsx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <Container sx={{ py: 5, background: '#FFFFFF' }}>
      <BackButton />
      <Typography variant="h4" sx={{ color: '#1C2526', mb: 3 }}>Business Dashboard</Typography>
      {user && (
        <Box sx={{ mb: 3 }}>
          <Typography sx={{ color: '#1C2526' }}>Email: {user.email}</Typography>
          <Typography sx={{ color: '#1C2526' }}>Plan: BUSINESS (3 Recruiters | 145 Submissions/Day)</Typography>
        </Box>
      )}
      {recruiters.map((recruiter, rIndex) => (
        <Box key={rIndex} sx={{ mt: 3, border: '1px solid #E1E8E9', p: 2 }}>
          <Typography variant="h5" sx={{ color: '#1C2526' }}>Recruiter {rIndex + 1}</Typography>
          {Array(5).fill(0).map((_, pIndex) => (
            <Box key={pIndex} sx={{ mt: 2 }}>
              <Typography variant="h6" sx={{ color: '#1C2526' }}>Profile {pIndex + 1}</Typography>
              <ProfileUpload onProfileUploaded={(profile) => {
                const newRecruiters = [...recruiters];
                newRecruiters[rIndex][pIndex] = { ...newRecruiters[rIndex][pIndex], ...profile };
                setRecruiters(newRecruiters);
              }} maxProfiles={1} />
              {recruiter[pIndex]?.keywords && (
                <JobApply keywords={recruiter[pIndex].keywords} maxResumes={1} maxSubmissions={145 / 3} profileId={recruiter[pIndex]._id} />
              )}
            </Box>
          ))}
        </Box>
      ))}
      <JobTracker />
      <Button variant="contained" onClick={handleExport} sx={{ mt: 3, background: '#1C2526', color: '#FFFFFF', '&:hover': { background: '#2E3839' } }}>
        Export Dashboard
      </Button>
    </Container>
  );
}

export default BusinessDashboard;