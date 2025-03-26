const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  console.log('Received Subscription Request:', { plan });

  if (!token) return res.status(401).json({ error: 'No token provided' });
  if (!plan) return res.status(400).json({ error: 'Missing plan' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) throw new Error('User not found');

    const planLimits = {
      STUDENT: { resumes: 1, submissions: 45 },
      RECRUITER: { resumes: 5, submissions: 45 },
      BUSINESS: { resumes: 3, submissions: 145 },
    };
    const selectedPlan = planLimits[plan];
    if (!selectedPlan) throw new Error(`Invalid plan: ${plan}`);

    user.subscription = plan;
    user.resumes = selectedPlan.resumes;
    user.submissions = selectedPlan.submissions;
    await user.save();

    res.status(200).json({ message: 'Subscription updated' });
  } catch (error) {
    console.error('Subscription Error:', error.message);
    res.status(400).json({ error: error.message || 'Failed to update subscription' });
  }
});

module.exports = router;