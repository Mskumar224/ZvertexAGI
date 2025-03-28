const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.subscription = plan;
    await user.save();

    let redirectPath;
    switch (plan) {
      case 'STUDENT': redirectPath = '/student-dashboard'; break;
      case 'RECRUITER': redirectPath = '/recruiter-dashboard'; break;
      case 'BUSINESS': redirectPath = '/business-dashboard'; break;
      default: redirectPath = '/';
    }

    res.json({ message: `Subscribed to ${plan} plan successfully`, redirect: redirectPath });
  } catch (error) {
    res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
});

module.exports = router;