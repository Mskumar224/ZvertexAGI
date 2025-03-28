import React from 'react';
import { Box, Typography, Button, Divider } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Sidebar({ isLoggedIn, setIsLoggedIn }) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/');
  };

  return (
    <Box sx={{ width: 250, background: '#fff', p: 2, boxShadow: 1 }}>
      <Typography variant="h6" sx={{ color: '#1976d2', mb: 2 }}>ZvertexAGI</Typography>
      <Divider sx={{ mb: 2 }} />
      <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/')}>Home</Button>
      <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/saas')}>SaaS</Button>
      <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/zgpt')}>ZGPT</Button>
      <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/petmic')}>PetMic</Button>
      <Divider sx={{ my: 2 }} />
      <Typography sx={{ color: '#1976d2', mb: 1 }}>For You</Typography>
      <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/subscription')}>
        Automate Your Career (Student)
      </Button>
      <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/subscription')}>
        Hire Smarter (Recruiter)
      </Button>
      <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/subscription')}>
        Scale Your Team (Business)
      </Button>
      <Divider sx={{ my: 2 }} />
      {isLoggedIn ? (
        <Button fullWidth sx={{ color: '#1976d2' }} onClick={handleLogout}>Logout</Button>
      ) : (
        <>
          <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/login')}>Login</Button>
          <Button fullWidth sx={{ mb: 1, justifyContent: 'flex-start' }} onClick={() => history.push('/signup')}>Sign Up</Button>
        </>
      )}
    </Box>
  );
}

export default Sidebar;