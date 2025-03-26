const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post('/subscribe', async (req, res) => {
  const { plan } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const planLimits = {
      STUDENT: { resumes: 1, submissions: 45 },
      RECRUITER: { resumes: 5, submissions: 45 },
      BUSINESS: { resumes: 3, submissions: 145 },
    };

    if (!planLimits[plan]) return res.status(400).json({ error: 'Invalid plan' });

    user.subscription = plan;
    user.resumes = planLimits[plan].resumes;
    user.submissions = planLimits[plan].submissions;
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Welcome to ZvertexAGI!',
      text: `Thank you for choosing the ${plan} plan! You can now upload ${planLimits[plan].resumes} resume(s) and submit up to ${planLimits[plan].submissions} applications per day - all for free!`,
    });

    res.json({ message: 'Subscription successful', plan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/update-selection', async (req, res) => {
  const { companies, technology } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.selectedCompanies = companies;
    user.selectedTechnology = technology;
    await user.save();

    res.json({ message: 'Selection updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;