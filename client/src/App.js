import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import JobApply from './pages/JobApply';
import ResetPassword from './pages/ResetPassword';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ZvertexAGI
          </Typography>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/saas-services">SaaS Services</Button>
          <Button color="inherit" component={Link} to="/petchat">PETchat</Button>
          <Button color="inherit" component={Link} to="/zgpt">Zgpt</Button>
          {localStorage.getItem('token') && (
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          )}
        </Toolbar>
      </AppBar>
      <Elements stripe={stripePromise}>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/student-dashboard" component={StudentDashboard} />
          <Route path="/recruiter-dashboard" component={RecruiterDashboard} />
          <Route path="/business-dashboard" component={BusinessDashboard} />
          <Route path="/job-apply" component={JobApply} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/saas-services" render={() => <Typography>SaaS Services Page</Typography>} />
          <Route path="/petchat" render={() => <Typography>PETchat Page</Typography>} />
          <Route path="/zgpt" render={() => <Typography>Zgpt Page</Typography>} />
        </Switch>
      </Elements>
    </Router>
  );
}

export default App;