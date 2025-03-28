import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('token', data.token);
      history.push('/subscription');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography variant="h4" align="center" sx={{ color: '#1976d2', mb: 4 }}>Login</Typography>
        <TextField label="Email" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 3 }} variant="outlined" />
        <TextField label="Password" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 3 }} variant="outlined" />
        <Button variant="contained" color="primary" fullWidth onClick={handleLogin} sx={{ py: 1.5 }}>Login</Button>
        {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
        <Typography sx={{ mt: 2, textAlign: 'center', color: '#6B7280' }}>
          Forgot Password? <Button color="primary" onClick={() => history.push('/forgot-password')}>Reset</Button>
        </Typography>
      </Box>
    </Container>
  );
}

export default Login;