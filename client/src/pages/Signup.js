import React, { useState, useCallback } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import debounce from 'lodash/debounce';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSignup = useCallback(
    debounce(async () => {
      try {
        if (!email || !password) throw new Error('Email and password are required');
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
        console.log('Signup Response:', response.data);
        alert('Signup successful! Please login.');
        history.push('/login');
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'Unknown error';
        console.log('Signup Error:', errorMsg);
        alert(`Signup failed: ${errorMsg}`);
      }
    }, 1000),
    [email, password, history]
  );

  return (
    <Container maxWidth="sm" sx={{ py: 5, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>
        Create Your Account
      </Typography>
      <Box component="form" sx={{ mt: 3 }}>
        <TextField
          label="Email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
          required
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
          variant="outlined"
          required
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSignup}
          fullWidth
          sx={{ py: 1.5 }}
          disabled={!email || !password}
        >
          Sign Up
        </Button>
      </Box>
      <Typography sx={{ mt: 2, textAlign: 'center' }}>
        Already have an account? <a href="/login">Login</a>
      </Typography>
    </Container>
  );
}

export default Signup;