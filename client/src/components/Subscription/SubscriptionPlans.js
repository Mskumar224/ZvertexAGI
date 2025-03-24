import React from 'react';
import { Card, CardContent, Typography, Button, Grid, Box, Fade } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function SubscriptionPlans({ onComplete }) {
  const plans = [
    { name: 'STUDENT', price: 39, resumes: 1, submissions: 45, description: 'Ideal for students launching their careers with 1 resume and 45 daily submissions.' },
    { name: 'RECRUITER', price: 79, resumes: 5, submissions: 45, description: 'Perfect for recruiters managing up to 5 resumes with 45 daily submissions.' },
    { name: 'BUSINESS', price: 159, recruiters: 3, submissions: 145, description: 'Designed for businesses with 3 recruiters and 145 daily submissions.' },
  ];

  const handleSubscription = async (plan) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/create`,
        { plan: plan.name },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      if (data.sessionId) {
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: data.sessionId });
      } else {
        onComplete(); // Skip payment for now
      }
    } catch (err) {
      console.error('Subscription error:', err);
    }
  };

  const handleSkipPayment = () => onComplete(); // Allow skipping payment

  return (
    <Fade in timeout={500}>
      <Box>
        <Typography variant="h5" gutterBottom textAlign="center">Choose Your Subscription Plan</Typography>
        <Typography variant="subtitle1" color="textSecondary" textAlign="center" mb={4}>
          Unlock the power of ZvertexAGI with a plan tailored to your needs.
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {plans.map((plan) => (
            <Grid item xs={12} sm={4} key={plan.name}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" color="primary">{plan.name}</Typography>
                  <Typography variant="h4" gutterBottom>${plan.price}<Typography variant="caption">/month</Typography></Typography>
                  <Typography>{plan.resumes ? `${plan.resumes} Resume${plan.resumes > 1 ? 's' : ''}` : `${plan.recruiters} Recruiters`}</Typography>
                  <Typography>{plan.submissions} Submissions/day</Typography>
                  <Typography color="textSecondary" sx={{ mt: 1 }}>{plan.description}</Typography>
                </CardContent>
                <Box p={2}>
                  <Button variant="contained" fullWidth onClick={() => handleSubscription(plan)}>Select & Pay</Button>
                  <Button variant="outlined" fullWidth sx={{ mt: 1 }} onClick={handleSkipPayment}>Skip Payment (Temporary)</Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Fade>
  );
}

export default SubscriptionPlans;