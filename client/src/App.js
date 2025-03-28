import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, Typography, useMediaQuery } from '@mui/material';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import JobApply from './pages/JobApply';
import Saas from './pages/Saas';
import Zgpt from './pages/Zgpt';
import Petmic from './pages/Petmic';

const drawerWidth = 240;

function App() {
  const token = localStorage.getItem('token');
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row' }}>
        <CssBaseline />
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#1976d2', color: '#fff' },
          }}
        >
          <Box sx={{ overflow: 'auto', p: 2 }}>
            <Typography 
              variant="h6" 
              sx={{ cursor: 'pointer', mb: 2, textAlign: 'center' }} 
              onClick={() => window.location.href = '/'}
            >
              ZvertexAI
            </Typography>
            <List>
              {[
                { text: 'Discover Jobs', path: '/', desc: 'Find your dream job with AI' },
                { text: 'Student Benefits', path: '/student-dashboard', desc: 'Auto-apply for students' },
                { text: 'Recruiter Tools', path: '/recruiter-dashboard', desc: 'Manage 5 profiles' },
                { text: 'Business Growth', path: '/business-dashboard', desc: 'Scale with 3 recruiters' },
                { text: 'ZGpt Search', path: '/zgpt', desc: 'Ask anything, get answers' },
              ].map((item) => (
                <ListItem button key={item.text} onClick={() => window.location.href = item.path}>
                  <ListItemText primary={item.text} secondary={item.desc} secondaryTypographyProps={{ style: { color: '#bbdefb' } }} />
                </ListItem>
              ))}
              {token ? (
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              ) : (
                <>
                  <ListItem button onClick={() => window.location.href = '/signup'}>
                    <ListItemText primary="Signup" />
                  </ListItem>
                  <ListItem button onClick={() => window.location.href = '/login'}>
                    <ListItemText primary="Login" />
                  </ListItem>
                </>
              )}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, background: '#f5f5f5', minHeight: '100vh' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/subscription" component={Subscription} />
            <Route path="/student-dashboard" component={StudentDashboard} />
            <Route path="/recruiter-dashboard" component={RecruiterDashboard} />
            <Route path="/business-dashboard" component={BusinessDashboard} />
            <Route path="/job-apply" component={JobApply} />
            <Route path="/saas" component={Saas} />
            <Route path="/zgpt" component={Zgpt} />
            <Route path="/petmic" component={Petmic} />
            <Route path="*" render={() => <Redirect to="/" />} />
          </Switch>
        </Box>
      </Box>
    </Router>
  );
}

export default App;