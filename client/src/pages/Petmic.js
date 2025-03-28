import React from 'react';
import { Container, Typography } from '@mui/material'; // Removed unused Box

function Petmic() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ color: '#1976d2', mb: 4 }}>
        Petmic Page
      </Typography>
      <Typography>Content for Petmic goes here.</Typography>
    </Container>
  );
}

export default Petmic;