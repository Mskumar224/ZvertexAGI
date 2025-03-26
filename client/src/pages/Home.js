import React, { useEffect } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

function Home() {
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        const subscription = response.data.subscription || 'STUDENT';
        const redirectMap = {
          STUDENT: '/student-dashboard',
          RECRUITER: '/recruiter-dashboard',
          BUSINESS: '/business-dashboard',
        };
        history.push(redirectMap[subscription] || '/student-dashboard');
      }).catch(() => {
        localStorage.removeItem('token');
      });
    }
  }, [history]);

  return (
    <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #1976d2, #ffffff)' }}>
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