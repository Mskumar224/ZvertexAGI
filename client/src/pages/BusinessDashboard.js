import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, List, ListItem, ListItemText } from '@mui/material';
import axios from 'axios';

function BusinessDashboard() {
  const [user, setUser] = useState(null);
  const [recruiters, setRecruiters] = useState([]);
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

        const recruitersResponse = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/recruiters`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecruiters(recruitersResponse.data);

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

  const handleAddRecruiter = async () => {
    if (recruiters.length >= 3) return alert('Max 3 recruiters allowed');
    const email = prompt('Enter recruiter email:');
    if (!email) return;

    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/add-recruiter`,
        { email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecruiters([...recruiters, data]);
    } catch (err) {
      alert('Failed to add recruiter');
    }
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
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>Business Dashboard</Typography>
      {user ? (
        <Box>
          <Typography variant="h6">Welcome, {user.name || user.email}</Typography>
          <Typography>Subscription: {user.subscription}</Typography>
          <Typography>Recruiters Managed: {recruiters.length}/3</Typography>
          <Typography>Jobs Applied: {jobs.length}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2, mr: 2 }} onClick={handleAddRecruiter}>
            Add Recruiter
          </Button>
          <Button variant="contained" color="secondary" sx={{ mt: 2 }} onClick={handleExport}>
            Export Dashboard
          </Button>
          <List>
            {recruiters.map((recruiter) => (
              <ListItem key={recruiter._id}>
                <ListItemText primary={recruiter.email} />
              </ListItem>
            ))}
          </List>
        </Box>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}

export default BusinessDashboard;