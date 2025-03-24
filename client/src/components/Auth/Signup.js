import React, { useState, useContext } from 'react';
import { Button, TextField, Box, Typography, Card, Alert } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SubscriptionPlans from '../Subscription/SubscriptionPlans';
import { ModalContext } from '../../App';

function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { openModal } = useContext(ModalContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/signup`, { email, password });
      localStorage.setItem('token', res.data.token);
      openModal(<SubscriptionPlans onComplete={() => navigate('/dashboard')} />);
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <Card sx={{ p: 3, flex: 1 }}>
      <Box component="form" onSubmit={handleSignup}>
        <Typography variant="h5" gutterBottom>Sign Up</Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
      </Box>
    </Card>
  );
}

export default Signup;