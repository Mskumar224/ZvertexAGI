const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');
const { sendJobAppliedEmail } = require('../server');
const axios = require('axios'); // For real-time job fetching

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/upload-resume', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (!req.files || !req.files.resume) return res.status(400).json({ error: 'No resume file uploaded' });

    const resume = req.files.resume;
    const keywords = await parseResume(resume);
    res.json({ keywords });
  } catch (error) {
    console.error('Resume Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const jobs = user.jobsApplied || [];
    res.json(jobs);
  } catch (error) {
    console.error('Job Tracker Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch job tracker data' });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { companies, keywords } = req.body;
  try {
    // Simulate real-time job fetching (replace with actual API like Indeed/LinkedIn)
    const jobs = [];
    for (const company of companies) {
      const response = await axios.get(`https://api.example.com/jobs?company=${company}&keywords=${keywords.join(',')}`);
      jobs.push(...response.data.map(job => ({
        id: job.id,
        title: job.title,
        company,
        link: job.url,
        applied: false,
        requiresDocs: job.requiresDocs || false,
      })));
    }
    res.json({ jobs });
  } catch (error) {
    console.error('Fetch Jobs Error:', error.message);
    res.json({ jobs: [] }); // Fallback to empty list
  }
});

router.post('/apply', async (req, res) => {
  const { jobId, company, title, link, requiresDocs } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingJob = await Job.findOne({ jobId, user: user._id });
    if (existingJob) return res.status(400).json({ error: 'Already applied to this job' });

    const job = new Job({
      jobId,
      title,
      company,
      link,
      applied: !requiresDocs,
      user: user._id,
      requiresDocs,
    });
    await job.save();
    user.jobsApplied.push(job._id);
    await user.save();

    if (!requiresDocs) {
      await sendJobAppliedEmail(user.email, job);
    }

    res.json({ message: requiresDocs ? 'Documents required' : `Applied to job ${jobId}`, job });
  } catch (error) {
    console.error('Job Apply Error:', error.message);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

module.exports = router;