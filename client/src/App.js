import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect, useHistory } from 'react-router-dom';
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
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

function Header() {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    history.push('/');
  };

  return (
    <AppBar position="static" sx={{ background: '#1976d2' }}>
      <Toolbar>
        <Button color="inherit" onClick={() => history.push('/')} sx={{ mr: 2 }}>
          <Typography variant="h6">ZvertexAGI</Typography>
        </Button>
        <Box sx={{ flexGrow: 1 }} />
        <Button color="inherit" onClick={() => history.push('/saas')}>SaaS</Button>
        <Button color="inherit" onClick={() => history.push('/zgpt')}>ZGPT</Button>
        <Button color="inherit" onClick={() => history.push('/petmic')}>PetMic</Button>
        {isLoggedIn ? (
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        ) : (
          <>
            <Button color="inherit" onClick={() => history.push('/login')}>Login</Button>
            <Button color="inherit" onClick={() => history.push('/signup')}>Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <Header />
      <Box sx={{ mt: 3 }}>
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
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
      </Box>
    </Router>
  );
}

export default App;