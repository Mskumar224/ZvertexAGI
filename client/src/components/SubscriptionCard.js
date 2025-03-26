import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

function SubscriptionCard({ title, price, resumes, submissions, description, onSelect }) {
  return (
    <Card sx={{ maxWidth: 300, boxShadow: 3, borderRadius: 2, '&:hover': { transform: 'scale(1.05)' } }}>
      <CardContent sx={{ textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: '#1976d2' }}>{title}</Typography>
        <Typography variant="h4" sx={{ my: 2 }}>${price}<span style={{ fontSize: '1rem' }}>/month</span></Typography>
        <Typography>{resumes} Resume(s)</Typography>
        <Typography>{submissions} Submissions/Day</Typography>
        <Typography sx={{ mt: 2, color: '#757575' }}>{description}</Typography>
        <Button variant="contained" onClick={onSelect} sx={{ mt: 3, background: '#1976d2' }}>Select Plan</Button>
      </CardContent>
    </Card>
  );
}

export default SubscriptionCard;