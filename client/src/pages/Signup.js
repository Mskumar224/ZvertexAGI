import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleSignup = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      localStorage.setItem('token', data.token);
      history.push('/subscription');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" align="center" sx={{ color: '#1976d2', mb: 4 }}>Sign Up</Typography>
      <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }} />
      <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} />
      <Button variant="contained" fullWidth onClick={handleSignup} sx={{ background: '#1976d2', py: 1.5 }}>Sign Up</Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Container>
  );
}

export default Signup;