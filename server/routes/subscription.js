const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.get('/plans', (req, res) => {
  res.json([
    { id: 'student', name: 'Student', price: 0, resumes: 1, submissions: 45 },
    { id: 'recruiter', name: 'Recruiter', price: 10, resumes: 5, submissions: 45 },
    { id: 'business', name: 'Business', price: 20, resumes: 3, submissions: 145 },
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
      STUDENT: { price: 39, resumes: 1, submissions: 45 },
      RECRUITER: { price: 79, resumes: 5, submissions: 45 },
      BUSINESS: { price: 159, resumes: 3, submissions: 145 },
    };

    if (!plans[plan]) return res.status(400).json({ message: 'Invalid plan' });

    if (paymentMethodId) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: plans[plan].price * 100,
        currency: 'usd',
        payment_method: paymentMethodId,
        confirm: true,
        return_url: 'https://zvertexagi.netlify.app/subscription', // Adjust as needed
      });
      if (paymentIntent.status !== 'succeeded') {
        throw new Error('Payment failed');
      }
    }

    user.subscription = plan;
    user.resumes = plans[plan].resumes;
    user.submissions = plans[plan].submissions;
    await user.save();

    res.json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Subscription Error:', error.message);
    res.status(400).json({ message: 'Subscription failed', error: error.message });
  }
});

module.exports = router;