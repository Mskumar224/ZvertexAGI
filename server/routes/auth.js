const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

router.post('/signup', async (req, res) => {
  const { email, password, name, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });
    
    const defaultCompanies = ['Indeed', 'LinkedIn', 'Glassdoor'];
    const defaultTechnology = 'JavaScript';
    
    const user = new User({
      email,
      password,
      name,
      phone,
      selectedCompanies: defaultCompanies,
      selectedTechnology: defaultTechnology,
    });
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    
    // Initial job application after signup
    const jobs = await Promise.all(defaultCompanies.map(async (company, index) => {
      const uniqueId = `${company}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      try {
        const response = await axios.get(`https://api.indeed.com/ads/apisearch`, {
          params: {
            publisher: process.env.INDEED_PUBLISHER_ID,
            v: 2,
            format: 'json',
            q: `${defaultTechnology} ${company}`,
            limit: 1,
            start: index,
          },
          timeout: 5000,
        });
        const job = response.data.results[0];
        return {
          id: job.jobkey,
          title: job.jobtitle,
          company: job.company,
          link: job.url,
          requiresDocs: false,
        };
      } catch (error) {
        return {
          id: `${uniqueId}-1`,
          title: `${defaultTechnology} Engineer ${uniqueId}`,
          company,
          link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers/job-${uniqueId}-1`,
          requiresDocs: false,
        };
      }
    }));

    for (const job of jobs) {
      const newJob = new Job({
        jobId: job.id,
        title: job.title,
        company: job.company,
        link: job.link,
        applied: true,
        user: user._id,
        requiresDocs: job.requiresDocs,
      });
      await newJob.save();
      user.jobsApplied.push(newJob._id);
      await user.save();

      await transporter.sendMail({
        from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
        to: email,
        subject: 'ZvertexAGI - Initial Job Application Confirmation',
        html: `
          <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
            <h2 style="color: #1976d2;">Auto-Application Confirmed</h2>
            <p>Dear ${name || email},</p>
            <p>We’ve auto-applied for you to:</p>
            <ul>
              <li><strong>Position:</strong> ${job.title}</li>
              <li><strong>Company:</strong> ${job.company}</li>
              <li><strong>Job ID:</strong> ${job.id}</li>
              <li><strong>Link:</strong> <a href="${job.link}" style="color: #1976d2;">${job.link}</a></li>
            </ul>
            <p>This will continue every 30 minutes with new positions!</p>
            <p>Best regards,<br>The ZvertexAGI Team</p>
          </div>
        `,
      });
    }

    await transporter.sendMail({
      from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
      to: email,
      subject: 'Welcome to ZvertexAGI - Auto-Apply Activated!',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Welcome, ${name || email}!</h2>
          <p>Your account is set up, and we’ve activated auto-apply for jobs every 30 minutes using:</p>
          <ul>
            <li><strong>Technology:</strong> ${defaultTechnology}</li>
            <li><strong>Companies:</strong> ${defaultCompanies.join(', ')}</li>
          </ul>
          <p>You’ll receive confirmation emails for each application. Update your preferences anytime in the dashboard!</p>
          <p>Best regards,<br>The ZvertexAGI Team</p>
        </div>
      `,
    });
    
    res.status(201).json({ token });
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
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ email: user.email, subscription: user.subscription, name: user.name, phone: user.phone });
  } catch (error) {
    res.status(500).json({ error: 'User fetch failed' });
  }
});

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `https://zvertexagi.netlify.app/reset-password?token=${token}`;
    await transporter.sendMail({
      from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
      to: email,
      subject: 'ZvertexAGI - Password Reset Request',
      html: `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Reset Your Password</h2>
          <p>Dear ${email},</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <a href="${resetLink}" style="color: #1976d2;">Reset Password</a>
          <p>If you didn’t request this, ignore this email.</p>
          <p>Best regards,<br>The ZvertexAGI Team</p>
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