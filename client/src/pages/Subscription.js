import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import SubscriptionCard from '../components/SubscriptionCard';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Subscription() {
  const history = useHistory();

  const plans = [
    { title: 'STUDENT', price: 39, resumes: 1, submissions: 45, description: 'Perfect for students starting their career.' },
    { title: 'RECRUITER', price: 79, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing multiple profiles.' },
    { title: 'BUSINESS', price: 159, resumes: 3, submissions: 145, description: 'Designed for businesses hiring at scale.' },
  ];

  const handleSubscription = async (plan) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found. Please log in again.');

      const payload = { plan: plan.title };
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Subscription response:', response.data); // For debugging

      const redirectMap = {
        STUDENT: '/student-dashboard',
        RECRUITER: '/recruiter-dashboard',
        BUSINESS: '/business-dashboard',
      };
      history.push(redirectMap[plan.title]);
    } catch (error) {
      const errorDetails = error.response ? error.response.data : { error: error.message };
      console.error('Subscription Error:', errorDetails);
      alert(errorDetails.error || 'Subscription update failed! Please try again.');
    }
  };

  return (
    <Container sx={{ py: 8, background: '#f5f5f5' }}>
      <Typography variant="h3" align="center" gutterBottom sx={{ color: '#1976d2', fontWeight: 'bold' }}>
        Choose Your Plan
      </Typography>
      <Typography align="center" sx={{ mb: 5, color: '#616161' }}>
        Select any plan to start using the service—no payment required.
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
    </Container>
  );
}

export default Subscription;