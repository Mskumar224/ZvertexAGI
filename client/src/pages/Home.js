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
          <Button color="inherit" onClick={() => alert('SaaS: Streamlined cloud solutions for businesses.')}>SaaS</Button>
          <Button color="inherit" onClick={() => alert('ZGPT: Next-gen AI for smarter decisions.')}>ZGPT</Button>
          <Button color="inherit" onClick={() => alert('PetMic: Innovative tools for pet care.')}>PetMic</Button>
          <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
          <Button color="inherit" onClick={() => history.push('/signup')}>Sign Up</Button>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h2" sx={{ color: '#fff', fontWeight: 'bold', mb: 3 }}>
          Your Career, Automated
        </Typography>
        <Typography variant="h5" sx={{ color: '#fff', mb: 5 }}>
          ZvertexAGI simplifies your job search with cutting-edge automation. Upload your resume, pick your dream companies, 
          and let us apply to the latest opportunities for you - all for free. Join today and take control of your future!
        </Typography>
        <Button variant="contained" size="large" onClick={() => history.push('/signup')} sx={{ background: '#fff', color: '#1976d2', fontWeight: 'bold' }}>
          Start for Free
        </Button>
      </Container>
    </Box>
  );
}

export default Home;