import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import { Box, CssBaseline, Drawer, List, ListItem, ListItemText, Button } from '@mui/material';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box', backgroundColor: '#1976d2', color: '#fff' },
          }}
        >
          <Box sx={{ overflow: 'auto' }}>
            <List>
              {[
                { text: 'Home', path: '/' },
                { text: 'Signup', path: '/signup' },
                { text: 'Login', path: '/login' },
                { text: 'Subscription', path: '/subscription' },
                { text: 'Student Dashboard', path: '/student-dashboard' },
                { text: 'Recruiter Dashboard', path: '/recruiter-dashboard' },
                { text: 'Business Dashboard', path: '/business-dashboard' },
                { text: 'Job Apply', path: '/job-apply' },
              ].map((item) => (
                <ListItem button key={item.text} onClick={() => window.location.href = item.path}>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
              {token && (
                <ListItem button onClick={handleLogout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              )}
            </List>
          </Box>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, background: '#f5f5f5' }}>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
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