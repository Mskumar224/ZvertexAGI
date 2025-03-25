import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [plan, setPlan] = useState('');
  const [paymentOption, setPaymentOption] = useState('payNow');
  const history = useHistory();

  const handleSignup = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, {
        email,
        password,
        plan,
        payLater: paymentOption === 'payLater'
      });
      localStorage.setItem('token', response.data.token);
      console.log('Token after signup:', response.data.token); // For debugging
      alert('Signup successful! Choose your plan next.');
      history.push('/subscription');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Signup failed due to an unexpected error.';
      console.error('Signup Error:', error.response ? error.response.data : error.message);
      alert(errorMessage);
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
        <Select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          displayEmpty
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="" disabled>Select a Plan (Optional)</MenuItem>
          <MenuItem value="STUDENT">Student ($39/month)</MenuItem>
          <MenuItem value="RECRUITER">Recruiter ($79/month)</MenuItem>
          <MenuItem value="BUSINESS">Business ($159/month)</MenuItem>
        </Select>
        <Select
          value={paymentOption}
          onChange={(e) => setPaymentOption(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
        >
          <MenuItem value="payNow">Pay Now</MenuItem>
          <MenuItem value="payLater">Pay Later</MenuItem>
        </Select>
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