import React from 'react';
import { Card, CardContent, Typography, Button, Grid, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

function SubscriptionPlans({ onComplete }) {
  const plans = [
    { name: 'STUDENT', price: 39, resumes: 1, submissions: 45, description: 'Perfect for students starting their career' },
    { name: 'RECRUITER', price: 79, resumes: 5, submissions: 45, description: 'Ideal for recruiters managing multiple profiles' },
    { name: 'BUSINESS', price: 159, recruiters: 3, submissions: 145, description: 'Best for businesses with hiring teams' },
  ];
  const navigate = useNavigate();

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
        onComplete();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button onClick={() => navigate('/')} variant="text" color="primary">
          ZvertexAGI
        </Button>
      </Box>
      <Typography variant="h5" gutterBottom textAlign="center">
        Choose Your Subscription Plan
      </Typography>
      <Grid container spacing={3} justifyContent="center">
        {plans.map((plan) => (
          <Grid item xs={12} sm={4} key={plan.name}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" color="primary">
                  {plan.name}
                </Typography>
                <Typography variant="h4" gutterBottom>
                  ${plan.price}<Typography variant="caption">/month</Typography>
                </Typography>
                <Typography>
                  {plan.resumes ? `${plan.resumes} Resume${plan.resumes > 1 ? 's' : ''}` : `${plan.recruiters} Recruiters`}
                </Typography>
                <Typography>{plan.submissions} Submissions/day</Typography>
                <Typography color="textSecondary" sx={{ mt: 1 }}>
                  {plan.description}
                </Typography>
              </CardContent>
              <Box p={2}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => handleSubscription(plan)}
                >
                  Select Plan
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SubscriptionPlans;