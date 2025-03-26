import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useHistory, useLocation } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');

  const handleReset = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/reset-password`,
        { token, password },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setError(null);
      alert('Password reset successful!');
      history.push('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" gutterBottom>Reset Password</Typography>
      <TextField
        label="New Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        sx={{ mb: 3 }}
      />
      <Button variant="contained" onClick={handleReset}>Reset Password</Button>
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
    </Container>
  );
}

export default ResetPassword;