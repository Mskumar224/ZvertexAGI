const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendSubscriptionEmail } = require('../utils/dailyEmail'); // Corrected import

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  console.log('Subscription Request:', { plan, tokenProvided: !!token });

  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }
  if (!plan) {
    return res.status(400).json({ error: 'Missing plan' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const planLimits = {
      STUDENT: { resumes: 1, submissions: 45 },
      RECRUITER: { resumes: 5, submissions: 45 },
      BUSINESS: { resumes: 3, submissions: 145 },
    };

    if (!planLimits[plan]) {
      return res.status(400).json({ error: `Invalid plan: ${plan}` });
    }

    user.subscription = plan;
    user.resumes = planLimits[plan].resumes;
    user.submissions = planLimits[plan].submissions;
    await user.save();

    await sendSubscriptionEmail(user.email, plan);

    res.status(200).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Subscription Error:', error.message);
    res.status(500).json({ error: error.message || 'An error occurred during subscription processing' });
  }
});

module.exports = router;