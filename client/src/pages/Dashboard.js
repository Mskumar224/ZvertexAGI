import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ResumeUpload from '../components/Resume/ResumeUpload';
import UserDashboard from '../components/Dashboard/UserDashboard';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button onClick={() => navigate('/')} variant="text" color="primary">
          ZvertexAGI
        </Button>
      </Box>
      <Typography variant="h2" gutterBottom textAlign="center">
        {user?.subscription?.plan ? `${user.subscription.plan} Dashboard` : 'Welcome to Your Dashboard'}
      </Typography>
      {user && (
        <Box>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5">Your Plan: {user.subscription?.plan || 'None'}</Typography>
            <Typography>
              {user.subscription?.resumes
                ? `${user.subscription.resumes} Resume${user.subscription.resumes > 1 ? 's' : ''}`
                : user.subscription?.recruiters
                ? `${user.subscription.recruiters} Recruiters`
                : 'No plan selected'}
            </Typography>
            <Typography>{user.subscription?.submissions || 0} Submissions/day</Typography>
          </Paper>
          <ResumeUpload subscription={user.subscription} />
          <UserDashboard subscription={user.subscription} />
        </Box>
      )}
    </Container>
  );
}

export default Dashboard;