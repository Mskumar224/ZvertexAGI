import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

function Saas() {
  return (
    <Container sx={{ py: 8 }}>
      <Typography variant="h2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
        SaaS Solutions
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        Custom SaaS platforms to streamline your business.
      </Typography>
      <Button variant="contained" sx={{ background: '#1976d2', color: '#fff' }} onClick={() => window.location.href = 'mailto:zvertexai@honotech.com'}>
        Contact Us
      </Button>
    </Container>
  );
}

export default Saas;