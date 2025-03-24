import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';
import ResumeUpload from '../components/Resume/ResumeUpload';
import UserDashboard from '../components/Dashboard/UserDashboard';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);

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

  const renderDashboardContent = () => {
    if (!user?.subscription?.plan) return <Typography>Please select a subscription plan to get started.</Typography>;
    switch (user.subscription.plan) {
      case 'STUDENT':
        return (
          <Box>
            <Typography variant="h6">Student Dashboard</Typography>
            <Typography>Manage your single resume and apply to up to 45 jobs daily.</Typography>
            <ResumeUpload subscription={user.subscription} />
            <UserDashboard subscription={user.subscription} />
          </Box>
        );
      case 'RECRUITER':
        return (
          <Box>
            <Typography variant="h6">Recruiter Dashboard</Typography>
            <Typography>Manage up to 5 resumes and apply to 45 jobs daily per resume.</Typography>
            <ResumeUpload subscription={user.subscription} />
            <UserDashboard subscription={user.subscription} />
          </Box>
        );
      case 'BUSINESS':
        return (
          <Box>
            <Typography variant="h6">Business Dashboard</Typography>
            <Typography>Collaborate with 3 recruiters and apply to 145 jobs daily.</Typography>
            <ResumeUpload subscription={user.subscription} />
            <UserDashboard subscription={user.subscription} />
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
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
          {renderDashboardContent()}
        </Box>
      )}
    </Container>
  );
}

export default Dashboard;