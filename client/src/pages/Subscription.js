import React, { useState } from 'react';
import { Container, Typography, Button, Card, CardContent, CardActions } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Subscription() {
  const [plan, setPlan] = useState('');
  const history = useHistory();

  const plans = [
    { name: 'STUDENT', price: '$10/month', limit: 45, path: '/student-dashboard' },
    { name: 'RECRUITER', price: '$15/month', limit: 45, path: '/recruiter-dashboard' },
    { name: 'BUSINESS', price: '$50/month', limit: 145, path: '/business-dashboard' },
  ];

  const handleSubscribe = async (selectedPlan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      history.push('/login');
      return;
    }

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subscription/subscribe`,
        { plan: selectedPlan.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPlan(selectedPlan.name);
      alert(`Subscribed to ${selectedPlan.name} plan!`);
      history.push(selectedPlan.path); // Redirect to appropriate dashboard
    } catch (err) {
      console.error('Subscription failed:', err);
      alert('Subscription failed.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4, textAlign: 'center' }}>
        Choose Your Subscription
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
                onClick={() => handleSubscribe(p)}
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