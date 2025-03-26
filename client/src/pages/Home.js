import React from 'react';
import { Container, Typography, Button, Box, AppBar, Toolbar } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Home() {
  const history = useHistory();

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2, #ffffff)' }}>
      <AppBar position="static" sx={{ background: '#1976d2' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>ZvertexAGI</Typography>
          <Button color="inherit" onClick={() => alert('SaaS: Scalable solutions for businesses.')}>SaaS</Button>
          <Button color="inherit" onClick={() => alert('ZGPT: AI-powered insights for all.')}>ZGPT</Button>
          <Button color="inherit" onClick={() => alert('PetMic: Tools for pet care innovation.')}>PetMic</Button>
          <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
          <Button color="inherit" onClick={() => history.push('/signup')}>Sign Up</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 'bold', mb: 3 }}>
          Simplify Your Job Search with ZvertexAGI
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff', mb: 5 }}>
          Automate your applications, track your progress, and land your dream job effortlessly. 
          Join thousands of professionals who trust us to streamline their career journey.
        </Typography>
        <Button variant="contained" size="large" onClick={() => history.push('/signup')} sx={{ background: '#fff', color: '#1976d2', fontWeight: 'bold' }}>
          Get Started Now
        </Button>
      </Container>
    </Box>
  );
}

export default Home;