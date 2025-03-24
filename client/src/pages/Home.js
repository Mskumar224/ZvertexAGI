import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

function Home() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" color="primary">Welcome to ZvertexAGI</Typography>
        <Typography variant="subtitle1" color="textSecondary">Your AI-powered job application assistant</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" gap={4}>
        <Login />
        <Signup />
      </Box>
    </Container>
  );
}

export default Home;