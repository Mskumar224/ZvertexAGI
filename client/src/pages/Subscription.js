import React, { useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import SubscriptionCard from '../components/SubscriptionCard';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Subscription() {
  const history = useHistory();
  const [error, setError] = useState('');

  const plans = [
    { title: 'STUDENT', price: 39, resumes: 1, submissions: 45, description: 'Perfect for students starting out.' },
    { title: 'RECRUITER', price: 79, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing talent.' },
    { title: 'BUSINESS', price: 159, resumes: 3, submissions: 145, description: 'Built for businesses scaling up.' },
  ];

  const handleSubscription = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/create-checkout-session`, // Updated endpoint
        { plan: plan.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Redirect to Stripe checkout URL
      window.location.href = data.url;
    } catch (err) {
      setError(err.response?.data?.error || 'Subscription failed');
    }
  };

  return (
    <Container sx={{ py: 8, background: '#f5f5f5' }}>
      <Typography variant="h3" align="center" sx={{ color: '#1976d2', mb: 4 }}>
        Choose Your Free Plan
      </Typography>
      <Typography align="center" sx={{ mb: 5, color: '#616161' }}>
        Select a plan tailored to your needs - no payment required!
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.title}>
            <SubscriptionCard
              title={plan.title}
              price={plan.price}
              resumes={plan.resumes}
              submissions={plan.submissions}
              description={`${plan.description} (Free Access)`}
              onSelect={() => handleSubscription(plan)}
            />
          </Grid>
        ))}
      </Grid>
      {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
    </Container>
  );
}

export default Subscription;