import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

function Petmic() {
  return (
    <Box sx={{ minHeight: '100vh', background: '#f5f5f5', py: 8 }}>
      <Container maxWidth="md">
        <Typography variant="h2" sx={{ color: '#1976d2', fontWeight: 'bold', mb: 4, textAlign: 'center' }}>
          PetMic - Innovating Pet Care
        </Typography>
        <Typography variant="h5" sx={{ color: '#333', mb: 3, textAlign: 'center' }}>
          Redefining Wellness for Pets and Owners
        </Typography>
        <Box sx={{ background: '#fff', p: 4, borderRadius: 2, boxShadow: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            PetMic by ZvertexAGI is at the forefront of pet care technology, delivering innovative tools that enhance the lives of pets and their owners. Our in-house development team is passionate about creating solutions that blend cutting-edge tech with a deep understanding of pet wellness.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>What We Offer:</strong>
            <ul>
              <li><strong>Smart Pet Tools:</strong> From health monitoring to interactive devices, we design products that prioritize pet happiness.</li>
              <li><strong>Custom Solutions:</strong> Tailored applications to meet the unique needs of pet care businesses and enthusiasts.</li>
              <li><strong>Innovation Hub:</strong> Our team is ready to co-develop groundbreaking pet tech with visionary partners.</li>
            </ul>
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            <strong>Join Our Mission:</strong> We’re seeking collaborators to join us in shaping the future of pet care through in-house projects. Let’s create something extraordinary for pets worldwide!
          </Typography>
          <Button variant="contained" sx={{ background: '#1976d2', color: '#fff', fontWeight: 'bold' }} onClick={() => window.location.href = 'mailto:zvertexai@honotech.com'}>
            Partner for Pet Tech Innovation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Petmic;