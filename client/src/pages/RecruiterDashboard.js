import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';

function RecruiterDashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
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
        Recruiter Dashboard
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
            Manage Job Applications
          </Button>
        </>
      ) : (
        <Typography>Loading...</Typography>
      )}
    </Container>
  );
}

export default RecruiterDashboard;