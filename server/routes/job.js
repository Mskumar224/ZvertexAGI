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

router.post('/verify-companies', async (req, res) => {
  const { companies } = req.body;
  const results = await Promise.all(companies.map(async (company) => {
    try {
      const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(company + ' official website')}`);
      return { name: company, valid: response.status === 200, website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com` };
    } catch (error) {
      return { name: company, valid: false };
    }
  }));
  res.json({ companies: results });
});

router.post('/fetch-jobs', async (req, res) => {
  const { companies, technology } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  const user = await User.findById(decoded.id);

  const jobs = companies.flatMap(company => [
    { id: `${company}-1`, title: `${technology} Engineer at ${company}`, company, link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/jobs/1`, requiresDocs: false },
    { id: `${company}-2`, title: `${technology} Analyst at ${company}`, company, link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/jobs/2`, requiresDocs: true },
  ]);

  const appliedJobs = await Job.find({ user: user._id }).select('jobId');
  const appliedIds = appliedJobs.map(job => job.jobId);
  const availableJobs = jobs.map(job => ({ ...job, applied: appliedIds.includes(job.id) }));

  res.json({ jobs: availableJobs });
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
      text: `You’ve applied to ${title} at ${company}. Job ID: ${jobId}. View details: ${link}`,
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