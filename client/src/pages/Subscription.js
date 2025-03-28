import React, { useState } from 'react';
import { Container, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';

function Subscription() {
  const [plan, setPlan] = useState('');

  const plans = [
    { name: 'STUDENT', price: '$10/month', limit: 45 },
    { name: 'RECRUITER', price: '$15/month', limit: 225 },
    { name: 'BUSINESS', price: '$50/month', limit: 675 },
  ];

  const handleSubscribe = async (selectedPlan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: selectedPlan },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(selectedPlan);
      alert(`Subscribed to ${selectedPlan} plan!`);
      window.location.href = data.redirect;
    } catch (err) {
      console.error('Subscription failed:', err);
      alert('Subscription failed: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography 
        variant="h4" 
        sx={{ color: '#1976d2', mb: 4, textAlign: 'center', cursor: 'pointer' }} 
        onClick={() => window.location.href = '/'}
      >
        ZvertexAI - Choose Your Subscription
      </Typography>
      <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap' }}>
        {plans.map((p) => (
          <Card key={p.name} sx={{ width: 250, m: 2 }}>
            <CardContent>
              <Typography variant="h6">{p.name}</Typography>
              <Typography>{p.price}</Typography>
              <Typography>Up to {p.limit} submissions/day</Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={() => handleSubscribe(p.name)}
                disabled={plan === p.name}
              >
                {plan === p.name ? 'Subscribed' : 'Subscribe'}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </Container>
  );
}

export default Subscription;