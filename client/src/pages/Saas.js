import React from 'react';
import { Container, Typography } from '@mui/material';

function Saas() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography 
        variant="h4" 
        sx={{ color: '#1976d2', mb: 4, cursor: 'pointer' }} 
        onClick={() => window.location.href = '/'}
      >
        ZvertexAI - SaaS
      </Typography>
      <Typography>Content for SaaS goes here.</Typography>
    </Container>
  );
}

export default Saas;