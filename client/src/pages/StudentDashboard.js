import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function StudentDashboard() {
  const [user, setUser] = useState(null);
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
  };

  const handleExport = () => {
    if (user?._id) {
      window.location.href = `${process.env.REACT_APP_API_URL}/api/job/export-dashboard/${user._id}`;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI - Student Dashboard
        </Typography>
        <Typography>Loading...</Typography>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography 
          variant="h4" 
          sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI - Student Dashboard
        </Typography>
        <Typography>Please log in to view your dashboard.</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={() => window.location.href = '/login'}>
          Login
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography 
        variant="h4" 
        sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
        onClick={() => window.location.href = '/'}
      >
        ZvertexAI - Student Dashboard
      </Typography>
      <Typography variant="h6">Welcome, {user.name || user.email}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Phone: {user.phone || 'Not provided'}</Typography>
      <Typography>Subscription: {user.subscription}</Typography>
      <Typography>
        Resume: {user.profiles?.length > 0 ? user.profiles[0].filename : 'None'}
      </Typography>
      <Typography>Technology: {user.selectedTechnology || 'Not selected'}</Typography>
      <Typography>Companies: {user.selectedCompanies?.join(', ') || 'None'}</Typography>
      <Typography>Jobs Applied: {user.jobsApplied?.length || 0}</Typography>
      <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={() => window.location.href = '/job-apply'}>
        Apply for Jobs
      </Button>
      <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleExport}>
        Export Dashboard
      </Button>
      <Box sx={{ mt: 4 }}>
        <DocumentUpload userId={user._id} onUploadSuccess={handleUploadSuccess} />
      </Box>
    </Container>
  );
}

export default StudentDashboard;