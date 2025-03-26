const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');
const axios = require('axios');
const nodemailer = require('nodemailer');

const JWT_SECRET = process.env.JWT_SECRET;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

router.post('/upload-resume', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!req.files || !req.files.resume) return res.status(400).json({ error: 'No resume uploaded' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resume = req.files.resume;
    const keywords = await parseResume(resume);
    res.json({ keywords });
  } catch (error) {
    res.status(500).json({ error: 'Resume parsing failed' });
  }
});

router.post('/verify-company', async (req, res) => {
  const { company } = req.body;
  try {
    const response = await axios.get(`https://www.google.com/search?q=${company}+official+website`);
    if (response.status === 200) {
      res.json({ valid: true, website: `https://${company.toLowerCase()}.com` }); // Simplified detection
    } else {
      res.json({ valid: false });
    }
  } catch (error) {
    res.json({ valid: false });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { company, keywords } = req.body;
  // Mock job data (replace with real job API like Indeed in production)
  const jobs = [
    { id: `${company}-1`, title: `Software Engineer at ${company}`, company, link: `https://${company.toLowerCase()}.com/jobs/1`, requiresDocs: false },
    { id: `${company}-2`, title: `Data Analyst at ${company}`, company, link: `https://${company.toLowerCase()}.com/jobs/2`, requiresDocs: true },
  ];
  res.json({ jobs });
});

router.post('/apply', async (req, res) => {
  const { jobId, company, title, link, requiresDocs } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingJob = await Job.findOne({ jobId, user: user._id });
    if (existingJob) return res.status(400).json({ error: 'Already applied' });

    const job = new Job({ jobId, title, company, link, applied: true, user: user._id, requiresDocs });
    await job.save();
    user.jobsApplied.push(job._id);
    await user.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Job Application Confirmation',
      text: `You’ve applied to ${title} at ${company}. Job ID: ${jobId}. View it here: ${link}`,
    });

    res.json({ message: 'Applied successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Application failed' });
  }
});

router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');
    res.json(user.jobsApplied || []);
  } catch (error) {
    res.status(500).json({ error: 'Tracker fetch failed' });
  }
});

module.exports = router;