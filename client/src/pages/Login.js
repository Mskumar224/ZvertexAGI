import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );
      localStorage.setItem('token', response.data.token);
      setError(null);
      history.push('/subscription'); // Redirect to subscription page after login
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Network Error';
      console.error('Login Error:', errorMessage, err);
      setError(errorMessage);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>
        Login
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
        />
        <Button variant="contained" color="primary" onClick={handleLogin} fullWidth sx={{ py: 1.5 }}>
          Login
        </Button>
        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
            {error}
          </Typography>
        )}
      </Box>
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Don’t have an account? <a href="/signup">Sign Up</a>
      </Typography>
    </Container>
  );
}

export default Login;