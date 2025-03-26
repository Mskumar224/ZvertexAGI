import React, { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch, useHistory } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import axios from 'axios';

const Home = lazy(() => import('./pages/Home'));
const Signup = lazy(() => import('./pages/Signup'));
const Login = lazy(() => import('./pages/Login'));
const Subscription = lazy(() => import('./pages/Subscription'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const RecruiterDashboard = lazy(() => import('./pages/RecruiterDashboard'));
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'));
const JobApply = lazy(() => import('./pages/JobApply'));
const Saas = lazy(() => import('./pages/Saas'));
const Zgpt = lazy(() => import('./pages/Zgpt'));
const Petmic = lazy(() => import('./pages/Petmic'));

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
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(response => {
        setIsLoggedIn(true);
        const subscription = response.data.subscription || 'STUDENT';
        const redirectMap = {
          STUDENT: '/student-dashboard',
          RECRUITER: '/recruiter-dashboard',
          BUSINESS: '/business-dashboard',
        };
        history.push(redirectMap[subscription] || '/student-dashboard');
      }).catch(() => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
      });
    }
  }, [history]);

  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Header />
        <Suspense fallback={<Typography>Loading...</Typography>}>
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
            </Switch>
          </Box>
        </Suspense>
      </Elements>
    </Router>
  );
}

export default App;