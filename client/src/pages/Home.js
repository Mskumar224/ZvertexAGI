import React from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container sx={{ py: 5, textAlign: 'center' }}>
      <Typography variant="h2" gutterBottom>Welcome to ZvertexAGI</Typography>
      <Typography variant="h5" gutterBottom>
        Elevate your career with our AI-driven job application platform. Upload your resume, select your subscription, and let us auto-apply to top jobs for you!
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ mt: 3 }}>
        Get Started
      </Button>
    </Container>
  );
}

export default Home;