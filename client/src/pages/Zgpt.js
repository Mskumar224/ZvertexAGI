import React from 'react';
import { Container, Typography } from '@mui/material'; // Removed unused Box

function Zgpt() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>
        Zgpt Page
      </Typography>
      <Typography>Content for Zgpt goes here.</Typography>
    </Container>
  );
}

export default Zgpt;