import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleSignup = async () => {
    console.log('API URL:', process.env.REACT_APP_API_URL);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      console.log('Signup Response:', response.data);
      alert('Signup successful! Please login.');
      history.push('/login');
    } catch (error) {
      console.error('Signup Error:', error.response ? error.response.data : error.message);
      alert('Signup failed! Check console for details.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5, background: '#fff', borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1976d2' }}>Create Your Account</Typography>
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
        <Button variant="contained" color="primary" onClick={handleSignup} fullWidth sx={{ py: 1.5 }}>
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