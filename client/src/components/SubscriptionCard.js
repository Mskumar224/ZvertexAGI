import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';

function SubscriptionCard({ title, price, resumes, submissions, onSelect }) {
  return (
    <Card sx={{ maxWidth: 300, m: 2 }}>
      <CardContent>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="h6">${price}/month</Typography>
        <Typography>{resumes} Resume(s)</Typography>
        <Typography>{submissions} Submissions/Day</Typography>
        <Button variant="contained" color="primary" onClick={onSelect} sx={{ mt: 2 }}>
          Select
        </Button>
      </CardContent>
    </Card>
  );
}

export default SubscriptionCard;