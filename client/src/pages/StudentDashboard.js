import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to access the dashboard');
        return;
      }

      try {
        const { data: userData } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userData);

        const { data: jobsData } = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/user-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsData || []);
      } catch (err) {
        console.error('Failed to fetch user:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      }
    };
    fetchUser();
  }, []);

  const handleUploadSuccess = () => {
    alert('Document uploaded successfully!');
  };

  const handleExport = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to export data');
      return;
    }

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/export-dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dashboard.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Export failed:', err);
      setError(err.response?.data?.message || 'Failed to export dashboard');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>Student Dashboard</Typography>
      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
      {user ? (
        <Box>
          <Typography variant="h6">Welcome, {user.name || user.email}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Phone: {user.phone || 'N/A'}</Typography>
          <Typography>Subscription: {user.subscription}</Typography>
          <Typography>Technology: {user.selectedTechnology || 'Not set'}</Typography>
          <Typography>Companies: {(user.selectedCompanies || []).join(', ') || 'Not set'}</Typography>
          <Typography>Jobs Applied: {jobs.length}</Typography>
          <DocumentUpload userId={user._id} onUploadSuccess={handleUploadSuccess} />
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={() => window.location.href = '/job-apply'}>
            Apply for Jobs
          </Button>
          <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleExport}>
            Export Dashboard
          </Button>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}

export default StudentDashboard;