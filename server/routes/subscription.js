// File Location: C:\Users\satee\OneDrive\Desktop\ZvertexAGI\ZvertexAGI\server\routes\subscription.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
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
      from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
      to: user.email,
      subject: 'Welcome to ZvertexAGI - Your Subscription is Active!',
      html: `
        <div style="font-family: Arial, sans-serif; color: #fff; background: #1c2526; padding: 20px;">
          <h2 style="color: #fff;">Welcome to ZvertexAGI!</h2>
          <p>Dear ${user.email},</p>
          <p>Thank you for choosing the <strong>${plan}</strong> plan! You’re now set to enjoy:</p>
          <ul>
            <li><strong>${planLimits[plan].resumes}</strong> resume(s) upload</li>
            <li><strong>${planLimits[plan].submissions}</strong> job submissions per day</li>
          </ul>
          <p>Start exploring your dashboard now!</p>
          <p>Best regards,<br>The ZvertexAGI Team</p>
        </div>
      `,
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