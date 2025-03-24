import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Auth/Login';
import Signup from '../components/Auth/Signup';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="flex-start" alignItems="center" mb={2}>
        <Button onClick={() => navigate('/')} variant="text" color="primary">
          ZvertexAGI
        </Button>
      </Box>
      <Box textAlign="center" mb={4}>
        <Typography variant="h2" color="primary">
          Welcome to ZvertexAGI
        </Typography>
        <Typography variant="subtitle1" color="textSecondary">
          Your AI-powered job application assistant
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between" gap={4}>
        <Login />
        <Signup />
      </Box>
    </Container>
  );
}

export default Home;