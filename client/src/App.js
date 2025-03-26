import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
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

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
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
      </Elements>
    </Router>
  );
}

export default App;