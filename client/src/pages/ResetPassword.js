import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useLocation, useHistory } from 'react-router-dom';

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const location = useLocation();
  const history = useHistory();
  const token = new URLSearchParams(location.search).get('token');

  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/reset-password`, { token, newPassword });
      setMessage(data.message);
      setError('');
      setTimeout(() => history.push('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed');
      setMessage('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Box sx={{ p: 4, background: '#fff', borderRadius: 2, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Typography 
          variant="h4" 
          align="center" 
          sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
          onClick={() => window.location.href = '/'}
        >
          ZvertexAGI - Reset Password
        </Typography>
        <TextField label="New Password" type="password" fullWidth value={newPassword} onChange={(e) => setNewPassword(e.target.value)} sx={{ mb: 3 }} variant="outlined" />
        <Button variant="contained" color="primary" fullWidth onClick={handleSubmit} sx={{ py: 1.5 }}>Reset Password</Button>
        {message && <Typography sx={{ mt: 2, color: '#1976d2', textAlign: 'center' }}>{message}</Typography>}
        {error && <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>{error}</Typography>}
      </Box>
    </Container>
  );
}

export default ResetPassword;