const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

// Valid plans for free access
const validPlans = ['STUDENT', 'RECRUITER', 'BUSINESS'];

router.post('/create-checkout-session', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const { plan } = req.body;

  // Validate inputs
  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }
  if (!plan || !validPlans.includes(plan)) {
    return res.status(400).json({ error: 'Invalid or missing plan. Must be STUDENT, RECRUITER, or BUSINESS' });
  }

  try {
    // Verify token and get user
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Assign the plan to the user (assuming User model has a 'plan' field)
    user.plan = plan;
    await user.save();

    // Return success response
    res.status(200).json({ message: `Successfully assigned ${plan} plan` });
  } catch (error) {
    console.error('Error in /create-checkout-session:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to assign plan', details: error.message });
  }
});

module.exports = router;