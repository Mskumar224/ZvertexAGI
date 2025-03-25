import React from 'react';
import { Card, CardContent, Typography, Button, Box } from '@mui/material';

function SubscriptionCard({ title, price, resumes, submissions, description, onSelect }) {
  return (
    <Card sx={{ maxWidth: 300, boxShadow: 3, borderRadius: 2, transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.05)' } }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#1976d2', fontWeight: 'bold' }}>{title}</Typography>
        <Typography variant="h4" sx={{ my: 2 }}>${price}<Typography component="span" variant="body2">/month</Typography></Typography>
        <Typography>{resumes} Resume(s)</Typography>
        <Typography>{submissions} Submissions/Day</Typography>
        <Typography sx={{ mt: 2, color: '#757575' }}>{description}</Typography>
        <Button variant="contained" color="primary" onClick={onSelect} sx={{ mt: 3, px: 4 }}>
          Choose Plan
        </Button>
      </CardContent>
    </Card>
  );
}

export default SubscriptionCard;