import React, { useState } from 'react';
import { Container, Typography, Grid, Box, CircularProgress } from '@mui/material';
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

    if (!stripe || !elements) {
      setPaymentError('Stripe has not loaded. Please try again.');
      setPaymentProcessing(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setPaymentError('Card input not found. Please refresh the page.');
      setPaymentProcessing(false);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setPaymentError('You must be logged in to subscribe.');
      setPaymentProcessing(false);
      history.push('/login');
      return;
    }

    try {
      // Create payment method
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentMethod || !paymentMethod.id) {
        throw new Error('Failed to create payment method.');
      }

      // Make subscription request
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { paymentMethodId: paymentMethod.id, plan: plan.title },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Subscription response:', response.data);

      if (response.data.clientSecret) {
        const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(response.data.clientSecret);
        if (confirmError) throw new Error(confirmError.message);
        if (paymentIntent.status === 'succeeded') redirectToDashboard(plan.title);
      } else if (response.data.message === 'Subscription successful') {
        redirectToDashboard(plan.title);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An unexpected error occurred';
      console.error('Subscription Error:', errorMessage);
      setPaymentError(`Subscription failed: ${errorMessage}`);
    } finally {
      setPaymentProcessing(false);
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
              disabled={paymentProcessing || !stripe || !elements}
            />
          </Grid>
        ))}
      </Grid>
      {stripe && elements ? (
        <Box sx={{ mt: 5, maxWidth: 400, mx: 'auto' }}>
          <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
          {paymentError && <Typography color="error" sx={{ mt: 2 }}>{paymentError}</Typography>}
          {paymentProcessing && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <CircularProgress size={24} />
              <Typography>Processing payment...</Typography>
            </Box>
          )}
        </Box>
      ) : (
        <Typography color="error" align="center" sx={{ mt: 5 }}>
          Stripe failed to load. Please refresh the page.
        </Typography>
      )}
    </Container>
  );
}

export default Subscription;