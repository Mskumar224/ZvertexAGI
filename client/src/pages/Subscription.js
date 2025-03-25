import React from 'react';
import { Container, Typography, Grid } from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import SubscriptionCard from '../components/SubscriptionCard';
import axios from 'axios';

function Subscription() {
  const stripe = useStripe();
  const elements = useElements();

  const plans = [
    { title: 'STUDENT', price: 39, resumes: 1, submissions: 45 },
    { title: 'RECRUITER', price: 79, resumes: 5, submissions: 45 },
    { title: 'BUSINESS', price: 159, resumes: 3, submissions: 145 },
  ];

  const handleSubscription = async (plan) => {
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    });

    if (error) {
      alert(error.message);
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { paymentMethodId: paymentMethod.id, plan: plan.title },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Subscription successful!');
      window.location.href = '/dashboard';
    } catch (err) {
      alert('Subscription failed!');
    }
  };

  return (
    <Container sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>Choose Your Plan</Typography>
      <Grid container justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.title}>
            <SubscriptionCard
              title={plan.title}
              price={plan.price}
              resumes={plan.resumes}
              submissions={plan.submissions}
              onSelect={() => handleSubscription(plan)}
            />
          </Grid>
        ))}
      </Grid>
      <CardElement sx={{ mt: 3 }} />
    </Container>
  );
}

export default Subscription;