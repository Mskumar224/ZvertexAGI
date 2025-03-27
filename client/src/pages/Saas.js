import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

function Saas() {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          SaaS Solutions by ZvertexAGI
        </Typography>
        <Typography variant="h5" sx={{ color: '#333', mb: 3, textAlign: 'center' }}>
          Transform Your Business with Scalable Cloud Innovation
        </Typography>
        <Box sx={{ background: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            At ZvertexAGI, we specialize in crafting bespoke Software-as-a-Service (SaaS) solutions that empower businesses to thrive in the digital age.
          </Typography>
          <Button variant="contained" sx={{ background: '#1976d2', color: '#fff' }} onClick={() => window.location.href = 'mailto:zvertexai@honotech.com'}>
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Saas;