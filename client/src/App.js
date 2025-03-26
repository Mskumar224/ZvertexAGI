import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import StudentDashboard from './pages/StudentDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import BusinessDashboard from './pages/BusinessDashboard';
import JobApply from './pages/JobApply';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

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
        <Typography variant="h6" sx={{ flexGrow: 1 }}>ZvertexAGI</Typography>
        <Button color="inherit" onClick={() => alert(
          'SaaS: Partner with us to build scalable cloud solutions tailored to your business. Our in-house expertise delivers cutting-edge platforms that drive efficiency and growth. Let’s collaborate on your next big project!'
        )}>SaaS</Button>
        <Button color="inherit" onClick={() => alert(
          'ZGPT: Leverage our advanced AI to transform your operations. From predictive analytics to automation, we offer in-house development for bespoke AI solutions. Bring your vision to us and let’s innovate together!'
        )}>ZGPT</Button>
        <Button color="inherit" onClick={() => alert(
          'PetMic: Revolutionize pet care with our innovative tools. We’re seeking partners to co-create groundbreaking in-house projects that enhance pet wellness. Join us to shape the future of pet tech!'
        )}>PetMic</Button>
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
      <Elements stripe={stripePromise}>
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
          </Switch>
        </Box>
      </Elements>
    </Router>
  );
}

export default App;