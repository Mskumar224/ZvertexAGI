import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

function Zgpt() {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          ZGPT - AI-Powered Innovation
        </Typography>
        <Typography variant="h5" sx={{ color: '#333', mb: 3, textAlign: 'center' }}>
          Unleash the Power of Artificial Intelligence
        </Typography>
        <Box sx={{ background: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ZGPT by ZvertexAGI is your gateway to advanced AI solutions that revolutionize how you operate.
          </Typography>
          <Button variant="contained" sx={{ background: '#1976d2', color: '#fff' }} onClick={() => window.location.href = 'mailto:zvertexai@honotech.com'}>
            Contact Us
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Zgpt;