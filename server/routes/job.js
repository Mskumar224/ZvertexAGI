const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');
const { sendJobAppliedEmail } = require('../utils/dailyEmail');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

router.post('/upload-resume', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  console.log('Upload Resume Request:', {
    tokenProvided: !!token,
    filesReceived: !!req.files,
    fileName: req.files?.resume?.name,
  });

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.log('User not found for ID:', decoded.id);
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.files || !req.files.resume) {
      console.log('No resume file in request');
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const resume = req.files.resume;
    const keywords = await parseResume(resume);
    console.log('Resume Parsed Successfully:', { keywords });
    res.json({ keywords });
  } catch (error) {
    console.error('Resume Upload Error:', error.message, error.stack);
    res.status(500).json({ error: 'Failed to upload resume', details: error.message });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { companies, keywords } = req.body;
  console.log('Fetch Jobs Request:', { companies, keywords });

  try {
    // Simulate job fetching (replace with real API later)
    const jobs = companies.map((company, index) => ({
      id: `job-${index}-${Date.now()}`,
      title: `Software Engineer - ${company}`,
      company,
      link: `https://${company.toLowerCase()}.com/careers`,
      applied: false,
      requiresDocs: index % 2 === 0, // Alternate for testing
    }));
    console.log('Jobs Fetched:', jobs);
    res.json({ jobs });
  } catch (error) {
    console.error('Fetch Jobs Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

router.post('/apply', async (req, res) => {
  const { jobId, company, title, link, requiresDocs } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  console.log('Apply Job Request:', { jobId, company });

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

    console.log('Job Applied:', { jobId, company });
    res.json({ message: requiresDocs ? 'Documents required' : `Applied to job ${jobId}`, job });
  } catch (error) {
    console.error('Job Apply Error:', error.message);
    res.status(500).json({ error: 'Failed to apply to job', details: error.message });
  }
});

router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  console.log('Tracker Request:', { tokenProvided: !!token });

  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');
    if (!user) return res.status(404).json({ error: 'User not found' });
    const jobs = user.jobsApplied || [];
    console.log('Tracker Response:', jobs);
    res.json(jobs);
  } catch (error) {
    console.error('Job Tracker Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch job tracker data', details: error.message });
  }
});

module.exports = router;