import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Subscription from './pages/Subscription';
import Dashboard from './pages/Dashboard';
import JobApply from './pages/JobApply';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Router>
      <Elements stripe={stripePromise}>
        <Navbar />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/subscription" component={Subscription} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/job-apply" component={JobApply} />
        </Switch>
      </Elements>
    </Router>
  );
}

export default App;