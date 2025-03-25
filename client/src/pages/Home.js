import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container sx={{ py: 8, textAlign: 'center', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)', minHeight: '100vh' }}>
      <Box sx={{ mb: 5 }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          Welcome to ZvertexAGI
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, mx: 'auto', color: '#424242' }}>
          Automate your job applications with AI. Upload your resume, choose a plan, and let us apply to top jobs for you.
        </Typography>
      </Box>
      <Button variant="contained" color="primary" component={Link} to="/signup" sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
        Get Started
      </Button>
    </Container>
  );
}

export default Home;