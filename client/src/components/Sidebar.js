import React from 'react';
import { Drawer, List, ListItem, ListItemText, Typography, Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

function Sidebar({ drawerWidth }) {
  const history = useHistory();
  const token = localStorage.getItem('token');

  const menuItems = [
    { text: 'Home', path: '/', desc: 'Explore ZvertexAGI' },
    { text: 'Signup', path: '/signup', desc: 'Join us today!' },
    { text: 'Login', path: '/login', desc: 'Access your account' },
    { text: 'Subscription', path: '/subscription', desc: 'Choose your plan' },
    { text: 'Student Dashboard', path: '/student-dashboard', desc: 'Manage your job hunt' },
    { text: 'Recruiter Dashboard', path: '/recruiter-dashboard', desc: 'Handle multiple profiles' },
    { text: 'Business Dashboard', path: '/business-dashboard', desc: 'Scale your hiring' },
    { text: 'Job Apply', path: '/job-apply', desc: 'Set up auto-apply' },
    { text: 'Zgpt', path: '/zgpt', desc: 'Ask our AI anything' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    history.push('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#1976d2', color: '#fff', p: 2 },
      }}
    >
      <Typography
        variant="h5"
        sx={{ p: 2, fontWeight: 'bold', cursor: 'pointer' }}
        onClick={() => history.push('/')}
      >
        ZvertexAGI
      </Typography>
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => history.push(item.path)}
            sx={{ borderRadius: 2, mb: 1, '&:hover': { backgroundColor: '#115293' } }}
          >
            <ListItemText
              primary={item.text}
              secondary={<Typography variant="caption" sx={{ color: '#b0c4de' }}>{item.desc}</Typography>}
            />
          </ListItem>
        ))}
        {token && (
          <ListItem
            button
            onClick={handleLogout}
            sx={{ borderRadius: 2, mb: 1, '&:hover': { backgroundColor: '#115293' } }}
          >
            <ListItemText primary="Logout" secondary={<Typography variant="caption" sx={{ color: '#b0c4de' }}>Sign out securely</Typography>} />
          </ListItem>
        )}
      </List>
      <Button
        variant="contained"
        color="secondary"
        sx={{ mt: 2, mx: 2 }}
        onClick={() => history.push('/subscription')}
      >
        Subscribe Now
      </Button>
    </Drawer>
  );
}

export default Sidebar;