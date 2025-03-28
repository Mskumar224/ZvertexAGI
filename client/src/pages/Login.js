import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, useMediaQuery } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      const redirectPath = data.subscription === 'STUDENT' ? '/student-dashboard' :
                           data.subscription === 'RECRUITER' ? '/recruiter-dashboard' :
                           data.subscription === 'BUSINESS' ? '/business-dashboard' : '/subscription';
      history.push(redirectPath);
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email to reset password');
      return;
    }
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/forgot-password`, { email });
      setError('');
      alert('Password reset link sent to your email');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography 
          variant={isMobile ? "h5" : "h4"} 
          align="center" 
          sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
          onClick={() => window.location.href = '/'}
        >
          ZvertexAI - Login
        </Typography>
        <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }} variant="outlined" />
        <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} variant="outlined" />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ py: 1.5 }}>Login</Button>
        {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
        <Typography sx={{ mt: 2, textAlign: 'center', color: '#6B7280' }}>
          Forgot Password? <Button color="primary" onClick={handleForgotPassword}>Reset</Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;