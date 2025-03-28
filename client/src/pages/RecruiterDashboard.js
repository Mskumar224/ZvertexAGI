import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';
import DocumentUpload from '../components/DocumentUpload';

function RecruiterDashboard() {
  const [user, setUser] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);

        const profilesResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/profiles`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfiles(profilesResponse.data);

        const jobsResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/job/user-jobs`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(jobsResponse.data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  const handleUploadSuccess = (data) => {
    setProfiles([...profiles, { _id: data.profileId, filename: data.filename }]);
  };

  const handleExport = async () => {
    const token = localStorage.getItem('token');
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
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>Recruiter Dashboard</Typography>
      {user ? (
        <Box>
          <Typography variant="h6">Welcome, {user.name || user.email}</Typography>
          <Typography>Subscription: {user.subscription}</Typography>
          <Typography>Profiles Managed: {profiles.length}/5</Typography>
          <Typography>Jobs Applied: {jobs.length}</Typography>
          {profiles.length < 5 && <DocumentUpload userId={user._id} onUploadSuccess={handleUploadSuccess} />}
          <List>
            {profiles.map((profile) => (
              <ListItem key={profile._id}>
                <ListItemText primary={profile.filename} />
              </ListItem>
            ))}
          </List>
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={() => window.location.href = '/job-apply'}>
            Manage Job Applications
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

export default RecruiterDashboard;