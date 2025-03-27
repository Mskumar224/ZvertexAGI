const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET;

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user._id, email: user.email, plan: user.plan } });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' });
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/update-profiles', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const { recruiterProfiles, businessRecruiters } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (recruiterProfiles && user.plan === 'RECRUITER') {
      user.recruiterProfiles = recruiterProfiles.slice(0, 5); // Limit to 5
    } else if (businessRecruiters && user.plan === 'BUSINESS') {
      user.businessRecruiters = businessRecruiters.slice(0, 3); // Limit to 3
    }
    await user.save();
    res.json({ message: 'Profiles updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profiles' });
  }
});

module.exports = router;