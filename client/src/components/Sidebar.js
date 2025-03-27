import React from 'react';
import { Box, Button, Typography } from '@mui/material';

function Sidebar() {
  return (
    <Box sx={{ width: 250, background: '#1976d2', color: 'white', height: '100vh', p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>ZvertexAGI</Typography>
      <Button fullWidth sx={{ mb: 1, color: 'white' }}>Home</Button>
      <Button fullWidth sx={{ mb: 1, color: 'white' }}>Why Us?</Button>
      <Button fullWidth sx={{ mb: 1, color: 'white' }}>Tips</Button>
      <Button fullWidth sx={{ mb: 1, color: 'white' }}>Support</Button>
    </Box>
  );
}

export default Sidebar;