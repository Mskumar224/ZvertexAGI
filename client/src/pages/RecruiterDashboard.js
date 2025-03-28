// File Location: C:\Users\satee\OneDrive\Desktop\ZvertexAGI\ZvertexAGI\client\src\pages\RecruiterDashboard.js
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import ResumeUpload from '../components/ResumeUpload';
import ProfileUpload from '../components/ProfileUpload';
import JobApply from './JobApply';
import JobTracker from '../components/JobTracker';
import axios from 'axios';
import BackButton from '../components/BackButton';

function RecruiterDashboard() {
  const [profiles, setProfiles] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(data);
        const profileRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/tracker`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setProfiles(profileRes.data.map(job => job.profile).filter(Boolean));
      } catch (err) {
        console.error(err);
        setError('Failed to load user data');
      }
    };
    fetchUser();
  }, []);

  const handleExport = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/export-dashboard`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        responseType: 'blob', // Handle binary response
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'dashboard.xlsx');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setError('');
      } else {
        throw new Error('Unexpected response status');
      }
    } catch (err) {
      console.error('Export failed:', err);
      setError('Failed to export dashboard. Please ensure the server is running and try again.');
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <BackButton />
      <Typography variant="h4" sx={{ color: '#fff', mb: 4, fontWeight: 'bold' }}>Recruiter Dashboard</Typography>
      {user && (
        <Box sx={{ mb: 4, p: 3, background: '#252525', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          <Typography sx={{ color: '#fff' }}>Email: {user.email}</Typography>
          <Typography sx={{ color: '#fff' }}>Plan: RECRUITER (5 Resumes | 45 Submissions/Day)</Typography>
        </Box>
      )}
      <ProfileUpload onProfileUploaded={(profile) => setProfiles([...profiles, profile])} maxProfiles={5} />
      {profiles.map((profile, index) => (
        <Box key={index} sx={{ mt: 4, p: 3, background: '#252525', borderRadius: 2, boxShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Profile {index + 1}</Typography>
          <ResumeUpload onResumeParsed={(keywords) => setProfiles(profiles.map((p, i) => i === index ? { ...p, keywords } : p))} maxResumes={1} />
          {profile?.keywords && <JobApply keywords={profile.keywords} maxResumes={1} maxSubmissions={45} profileId={profile._id} />}
        </Box>
      ))}
      <JobTracker />
      <Button variant="contained" onClick={handleExport} sx={{ mt: 4, background: '#007bff', '&:hover': { background: '#0056b3' } }}>
        Export Dashboard
      </Button>
      {error && <Typography sx={{ mt: 2, color: '#ff4444' }}>{error}</Typography>}
    </Container>
  );
}

export default RecruiterDashboard;