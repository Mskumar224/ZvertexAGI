import React, { useState } from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import SubscriptionCard from '../components/SubscriptionCard';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Subscription() {
  const stripe = useStripe();
  const elements = useElements();
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
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: plan.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optional Stripe payment
      if (stripe && elements) {
        const cardElement = elements.getElement(CardElement);
        const { paymentMethod } = await stripe.createPaymentMethod({ type: 'card', card: cardElement });
        await axios.post(
          `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
          { plan: plan.title, paymentMethodId: paymentMethod.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

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
    <Container sx={{ py: 8, background: '#f5f5f5' }}>
      <Typography variant="h3" align="center" sx={{ color: '#1976d2', mb: 4 }}>Choose Your Plan</Typography>
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
      {stripe && (
        <Box sx={{ mt: 5, maxWidth: 400, mx: 'auto' }}>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
        </Box>
      )}
      {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
    </Container>
  );
}

export default Subscription;