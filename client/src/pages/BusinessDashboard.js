import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material'; // Removed unused ResumeUpload
import axios from 'axios';

function BusinessDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(data);
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
    fetchUser();
  }, []);

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>
        Business Dashboard
      </Typography>
      {user ? (
        <>
          <Typography variant="h6">Welcome, {user.name || user.email}</Typography>
          <Typography>Subscription: {user.subscription}</Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => window.location.href = '/job-apply'}
          >
            Apply for Jobs
          </Button>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}

export default BusinessDashboard;