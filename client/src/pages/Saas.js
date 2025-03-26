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
            At ZvertexAGI, we specialize in crafting bespoke Software-as-a-Service (SaaS) solutions that empower businesses to thrive in the digital age. Our in-house team of experts leverages cutting-edge technologies to deliver scalable, secure, and user-centric platforms tailored to your unique needs.
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            <strong>Why Partner with Us?</strong>
            <ul>
              <li><strong>Custom Development:</strong> From concept to deployment, we build SaaS products that align perfectly with your business goals.</li>
              <li><strong>Scalability:</strong> Our cloud-based solutions grow with you, ensuring performance and reliability at any scale.</li>
              <li><strong>Expertise:</strong> With years of experience in SaaS innovation, we bring unmatched technical prowess to every project.</li>
            </ul>
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            <strong>Let’s Collaborate:</strong> We’re eager to partner with forward-thinking companies to co-create groundbreaking SaaS applications. Whether you need a new platform or want to enhance an existing one, ZvertexAGI is your trusted in-house development partner.
          </Typography>
          <Button variant="contained" sx={{ background: '#1976d2', color: '#fff', fontWeight: 'bold' }} onClick={() => window.location.href = 'mailto:zvertexai@honotech.com'}>
            Contact Us for In-House Projects
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Saas;