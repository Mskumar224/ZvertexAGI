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
            ZGPT by ZvertexAGI is your gateway to advanced AI solutions that revolutionize how you operate. Our in-house AI experts design and develop custom models to tackle your toughest challenges, from predictive analytics to intelligent automation.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Our AI Expertise:</strong>
            <ul>
              <li><strong>Tailored AI Models:</strong> We create bespoke AI systems that integrate seamlessly into your workflows.</li>
              <li><strong>Automation:</strong> Streamline processes and boost efficiency with intelligent automation tools.</li>
              <li><strong>Data-Driven Insights:</strong> Harness the power of your data with our advanced analytics solutions.</li>
            </ul>
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            <strong>Partner with Us:</strong> Bring your vision to life with ZGPT. We’re looking for innovative companies to collaborate on in-house AI projects that push boundaries and drive success. Let’s build the future together!
          </Typography>
          <Button variant="contained" sx={{ background: '#1976d2', color: '#fff', fontWeight: 'bold' }} onClick={() => window.location.href = 'mailto:zvertexai@honotech.com'}>
            Collaborate on AI Projects
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Zgpt;