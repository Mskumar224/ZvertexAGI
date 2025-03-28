import React, { useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import SubscriptionCard from '../components/SubscriptionCard';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Subscription() {
  const history = useHistory();
  const [error, setError] = useState('');

  const plans = [
    { title: 'STUDENT', price: 0, resumes: 1, submissions: 45, description: 'Automate your job hunt effortlessly.' },
    { title: 'RECRUITER', price: 0, resumes: 5, submissions: 45, description: 'Manage 5 profiles with ease.' },
    { title: 'BUSINESS', price: 0, resumes: 15, submissions: 145, description: 'Scale hiring with 3 recruiters.' },
  ];

  const handleSubscription = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: plan.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const redirectMap = {
        STUDENT: '/student-dashboard',
        RECRUITER: '/recruiter-dashboard',
        BUSINESS: '/business-dashboard',
      };
      history.push(redirectMap[plan.title]);
    } catch (err) {
      setError(err.response?.data?.error || 'Subscription failed');
    }
  };

  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h3" align="center" sx={{ color: '#1976d2', mb: 4 }}>
        Choose Your Free Plan
      </Typography>
      <Typography align="center" sx={{ mb: 5, color: '#616161' }}>
        Tailored automation for Students, Recruiters, and Businesses—no cost!
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
            />
          </Grid>
        ))}
      </Grid>
      {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
    </Container>
  );
}

export default Subscription;