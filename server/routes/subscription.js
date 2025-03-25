const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendEmail } = require('../utils/email');
const jwt = require('jsonwebtoken');

router.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const plans = {
      STUDENT: { price: 39, resumes: 1, submissions: 45 },
      RECRUITER: { price: 79, resumes: 5, submissions: 45 },
      BUSINESS: { price: 159, resumes: 3, submissions: 145 },
    };

    if (!plans[plan]) return res.status(400).json({ error: 'Invalid plan selected' });

    user.subscription = plan;
    user.resumes = plans[plan].resumes;
    user.submissions = plans[plan].submissions;
    user.payLater = true; // Always true since payment is bypassed
    await user.save();

    await sendEmail(user.email, 'Subscription Confirmation', `Welcome to the ${plan} plan! You can now upload ${plans[plan].resumes} resume(s) and submit up to ${plans[plan].submissions} applications per day.`);
    res.json({ message: 'Subscription updated' });
  } catch (error) {
    res.status(400).json({ error: 'Subscription failed', details: error.message });
  }
});

module.exports = router;