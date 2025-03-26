import React, { useState } from 'react';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
import SubscriptionCard from '../components/SubscriptionCard';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Subscription() {
  const history = useHistory();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const plans = [
    { title: 'STUDENT', price: 39, resumes: 1, submissions: 45, description: 'Perfect for students starting their career.' },
    { title: 'RECRUITER', price: 79, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing multiple profiles.' },
    { title: 'BUSINESS', price: 159, resumes: 3, submissions: 145, description: 'Designed for businesses hiring at scale.' },
  ];

  const handleSubscription = async (plan) => {
    setError(null);
    setProcessing(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You must be logged in to subscribe.');
      setProcessing(false);
      history.push('/login');
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: plan.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Subscription response:', response.data);

      if (response.data.message === 'Subscription successful') {
        redirectToDashboard(plan.title);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An unexpected error occurred';
      console.error('Subscription Error:', errorMessage);
      setError(`Subscription failed: ${errorMessage}`);
    } finally {
      setProcessing(false);
    }
  };

  const redirectToDashboard = (planTitle) => {
    const redirectMap = {
      STUDENT: '/student-dashboard',
      RECRUITER: '/recruiter-dashboard',
      BUSINESS: '/business-dashboard',
    };
    history.push(redirectMap[planTitle]);
  };

  return (
    <Container sx={{ py: 8, background: '#f5f5f5' }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Choose Your Subscription
      </Typography>
      <Typography align="center" sx={{ mb: 5, color: '#616161' }}>
        Select a plan tailored to your career or business needs.
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.title}>
            <SubscriptionCard
              title={plan.title}
              price={plan.price}
              resumes={plan.resumes}
              submissions={plan.submissions}
              description={plan.description}
              onSelect={() => handleSubscription(plan)}
              disabled={processing}
            />
          </Grid>
        ))}
      </Grid>
      {error && (
        <Typography color="error" align="center" sx={{ mt: 5 }}>
          {error}
        </Typography>
      )}
      {processing && (
        <Box sx={{ mt: 5, textAlign: 'center' }}>
          <CircularProgress size={24} />
          <Typography>Processing subscription...</Typography>
        </Box>
      )}
    </Container>
  );
}

export default Subscription;