const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
  const { email, password, plan, payLater } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const plans = {
      STUDENT: { resumes: 1, submissions: 45 },
      RECRUITER: { resumes: 5, submissions: 45 },
      BUSINESS: { resumes: 3, submissions: 145 },
    };

    const user = new User({
      email,
      password,
      subscription: plan && plans[plan] ? plan : 'NONE',
      payLater: payLater || false,
      resumes: plans[plan]?.resumes || 0,
      submissions: plans[plan]?.submissions || 0
    });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ message: 'User created', token });
  } catch (error) {
    res.status(400).json({ error: 'Signup failed', details: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: 'Login failed', details: error.message });
  }
});

router.get('/me', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(401).json({ error: 'Invalid token', details: error.message });
  }
});

module.exports = router;