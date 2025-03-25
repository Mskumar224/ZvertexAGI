import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>ZvertexAGI</Typography>
        <Button color="inherit" component={Link} to="/">Home</Button>
        <Button color="inherit" onClick={() => alert('SaaS: Coming Soon!')}>SaaS</Button>
        <Button color="inherit" onClick={() => alert('ZGpt: AI Chatbot - Coming Soon!')}>ZGpt</Button>
        <Button color="inherit" onClick={() => alert('PetMic: Pet Monitoring - Coming Soon!')}>PetMic</Button>
        <Button color="inherit" component={Link} to="/signup">Signup</Button>
        <Button color="inherit" component={Link} to="/login">Login</Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;