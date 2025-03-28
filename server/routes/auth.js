const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

router.post('/signup', async (req, res) => {
  const { email, password, name, phone, subscriptionType } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const user = new User({
      email,
      password,
      name,
      phone,
      subscription: subscriptionType || 'NONE',
      selectedCompanies: ['Indeed', 'LinkedIn', 'Glassdoor'],
      selectedTechnology: 'JavaScript',
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.status(201).json({ token, subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({ token, subscription: user.subscription });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('profiles jobsApplied recruiters');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      email: user.email,
      subscription: user.subscription,
      name: user.name,
      phone: user.phone,
      profiles: user.profiles,
      jobsApplied: user.jobsApplied,
      selectedTechnology: user.selectedTechnology,
      selectedCompanies: user.selectedCompanies,
      recruiters: user.recruiters,
    });
  } catch (error) {
    res.status(500).json({ error: 'User fetch failed', details: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `https://zvertexai.netlify.app/reset-password?token=${token}`;
    await transporter.sendMail({
      from: '"ZvertexAI Team" <zvertexai@honotech.com>',
      to: email,
      subject: 'ZvertexAI - Password Reset Request',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Reset Your Password</h2>
          <p>Dear ${email},</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <a href="${resetLink}" style="color: #1976d2;">Reset Password</a>
          <p>If you didn’t request this, ignore this email.</p>
          <p>Best regards,<br>The ZvertexAI Team</p>
        </div>
      `,
    });
    res.json({ message: 'Reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send reset link', error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.password = newPassword;
    await user.save();
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Reset failed', error: error.message });
  }
});

module.exports = router;