const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/plans', (req, res) => {
  res.json([
    { id: 'student', name: 'Student', price: 3900, resumes: 1, submissions: 45 }, // $39 in cents
    { id: 'recruiter', name: 'Recruiter', price: 7900, resumes: 5, submissions: 45 }, // $79 in cents
    { id: 'business', name: 'Business', price: 15900, resumes: 3, submissions: 145 } // $159 in cents
  ]);
});

router.post('/subscribe', async (req, res) => {
  const { paymentMethodId, plan } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const plans = {
      STUDENT: { price: 3900, resumes: 1, submissions: 45 },
      RECRUITER: { price: 7900, resumes: 5, submissions: 45 },
      BUSINESS: { price: 15900, resumes: 3, submissions: 145 },
    };

    if (!plans[plan]) return res.status(400).json({ message: 'Invalid plan' });

    // Create a PaymentIntent for live payment
    const paymentIntent = await stripe.paymentIntents.create({
      amount: plans[plan].price,
      currency: 'usd',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: true,
      return_url: 'https://67e2d3beb8e0310008311921--zvertexagi.netlify.app/subscription' // Adjust to your live URL
    });

    if (paymentIntent.status === 'requires_action') {
      return res.status(200).json({
        message: 'Payment requires additional action',
        clientSecret: paymentIntent.client_secret,
      });
    } else if (paymentIntent.status === 'succeeded') {
      // Update user subscription
      user.subscription = plan;
      user.resumes = plans[plan].resumes;
      user.submissions = plans[plan].submissions;
      await user.save();
      return res.json({ message: 'Subscription successful' });
    } else {
      throw new Error('Payment failed');
    }
  } catch (error) {
    console.error('Subscription Error:', error.message);
    res.status(400).json({ message: 'Subscription failed', error: error.message });
  }
});

module.exports = router;