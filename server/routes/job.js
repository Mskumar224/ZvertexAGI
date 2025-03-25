const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser'); // Assuming this utility exists

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// POST /api/job/upload-resume - Upload and parse resume
router.post('/upload-resume', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!req.files || !req.files.resume) {
      return res.status(400).json({ error: 'No resume file uploaded' });
    }

    const resume = req.files.resume;
    const keywords = await parseResume(resume); // Parse resume to extract keywords
    res.json({ keywords });
  } catch (error) {
    console.error('Resume Upload Error:', error.message);
    res.status(500).json({ error: 'Failed to upload resume' });
  }
});

// GET /api/job/tracker - Fetch user's applied jobs
router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const jobs = user.jobsApplied || [];
    res.json(jobs);
  } catch (error) {
    console.error('Job Tracker Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch job tracker data' });
  }
});

// Existing routes (for completeness)
router.post('/fetch-jobs', async (req, res) => {
  const { company, keywords } = req.body;
  const jobs = [
    { id: '1', title: `Software Engineer at ${company}`, company, link: `https://${company.toLowerCase()}.com/jobs/1`, applied: false },
  ];
  res.json({ jobs });
});

router.post('/apply', async (req, res) => {
  const { jobId } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const job = new Job({
      jobId,
      title: `Job ${jobId}`,
      company: 'Detected Company',
      link: `https://example.com/job${jobId}`,
      applied: true,
      user: user._id,
    });
    await job.save();
    user.jobsApplied.push(job._id);
    await user.save();

    res.json({ message: `Applied to job ${jobId}`, job });
  } catch (error) {
    console.error('Job Apply Error:', error.message);
    res.status(500).json({ error: 'Failed to apply to job' });
  }
});

module.exports = router;