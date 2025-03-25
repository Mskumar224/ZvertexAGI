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
  const [paymentError, setPaymentError] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const plans = [
    { title: 'STUDENT', price: 39, resumes: 1, submissions: 45, description: 'Perfect for students starting their career.' },
    { title: 'RECRUITER', price: 79, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing multiple profiles.' },
    { title: 'BUSINESS', price: 159, resumes: 3, submissions: 145, description: 'Designed for businesses hiring at scale.' },
  ];

  const handleSubscription = async (plan) => {
    setPaymentError(null);
    setPaymentProcessing(true);

    try {
      if (!stripe || !elements) {
        throw new Error('Stripe not initialized. Check your publishable key.');
      }

      const cardElement = elements.getElement(CardElement);
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }
      console.log('Payment Method ID:', paymentMethod.id); // Debug log

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { paymentMethodId: paymentMethod.id, plan: plan.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Server Response:', response.data); // Debug log

      if (response.data.clientSecret) {
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(
          response.data.clientSecret
        );
        if (confirmError) {
          throw new Error(confirmError.message);
        }
        if (paymentIntent.status === 'succeeded') {
          const redirectMap = {
            STUDENT: '/student-dashboard',
            RECRUITER: '/recruiter-dashboard',
            BUSINESS: '/business-dashboard',
          };
          history.push(redirectMap[plan.title]);
        }
      } else if (response.data.message === 'Subscription successful') {
        const redirectMap = {
          STUDENT: '/student-dashboard',
          RECRUITER: '/recruiter-dashboard',
          BUSINESS: '/business-dashboard',
        };
        history.push(redirectMap[plan.title]);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'Unknown error';
      console.error('Subscription Error:', errorMessage, err.response?.data); // Detailed log
      setPaymentError(`Subscription failed: ${errorMessage}`);
    } finally {
      setPaymentProcessing(false);
    }
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
              disabled={paymentProcessing}
            />
          </Grid>
        ))}
      </Grid>
      {stripe ? (
        <Box sx={{ mt: 5, maxWidth: 400, mx: 'auto' }}>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          {paymentError && (
            <Typography color="error" sx={{ mt: 2 }}>
              {paymentError}
            </Typography>
          )}
          {paymentProcessing && (
            <Typography sx={{ mt: 2 }}>Processing payment...</Typography>
          )}
        </Box>
      ) : (
        <Typography color="error" align="center" sx={{ mt: 5 }}>
          Stripe failed to load. Check your publishable key in environment variables.
        </Typography>
      )}
    </Container>
  );
}

export default Subscription;