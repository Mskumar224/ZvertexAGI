import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Grid } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function BusinessDashboard() {
  const [user, setUser] = useState(null);
  const [recruiters, setRecruiters] = useState([{}, {}, {}]); // 3 recruiters
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
        setRecruiters(data.recruiters?.slice(0, 3).map(r => ({ id: r._id })) || [{}, {}, {}]);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleUploadSuccess = (data) => {
    setUser(prev => ({
      ...prev,
      profiles: [...(prev?.profiles || []), { _id: data.profileId, extractedTech: data.detectedTech }],
    }));
    setRecruiters(prev => {
      const newRecruiters = [...prev];
      const emptyIndex = newRecruiters.findIndex(r => !r.id);
      if (emptyIndex !== -1) newRecruiters[emptyIndex] = { id: data.profileId };
      return newRecruiters;
    });
  };

  const handleExport = () => {
    if (user?._id) {
      window.location.href = `${process.env.REACT_APP_API_URL}/api/job/export-dashboard/${user._id}`;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI - Business Dashboard
        </Typography>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI - Business Dashboard
        </Typography>
        <Typography>Please log in to view your dashboard.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.location.href = '/login'}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography 
        variant="h4" 
        sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
        onClick={() => window.location.href = '/'}
      >
        ZvertexAI - Business Dashboard
      </Typography>
      <Typography variant="h6">Welcome, {user.name || user.email}</Typography>
      <Typography>Subscription: {user.subscription}</Typography>
      <Typography>Jobs Applied: {user.jobsApplied?.length || 0}</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={() => window.location.href = '/job-apply'}>
        Manage Job Applications
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleExport}>
        Export Dashboard
      </Button>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Manage Recruiters (3 Slots)</Typography>
        <Grid container spacing={4}>
          {recruiters.map((recruiter, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ p: 2, border: '1px solid #1976d2', borderRadius: 2 }}>
                <Typography variant="h6">Recruiter {index + 1} {recruiter.id ? '(Active)' : ''}</Typography>
                {!recruiter.id && <DocumentUpload userId={user._id} onUploadSuccess={handleUploadSuccess} />}
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
}

export default BusinessDashboard;