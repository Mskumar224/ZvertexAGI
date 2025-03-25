const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const { parseResume } = require('../utils/resumeParser');
const { sendEmail } = require('../utils/email');
const axios = require('axios');

router.post('/upload-resume', async (req, res) => {
  const resume = req.files.resume;
  const keywords = await parseResume(resume);
  res.json({ keywords });
});

router.post('/detect-company', async (req, res) => {
  const { company } = req.body;
  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${company}&format=json`);
    const valid = response.data.Heading.includes(company);
    res.json({ valid, company });
  } catch (error) {
    res.status(400).json({ error: 'Detection failed' });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { company, keywords } = req.body;
  // Mock job fetch (replace with real API like LinkedIn Jobs)
  const jobs = [
    { id: '1', title: 'Software Engineer', company, link: 'http://example.com/job1', requiresDocs: false },
    { id: '2', title: 'Data Analyst', company, link: 'http://example.com/job2', requiresDocs: true },
  ];
  res.json({ jobs });
});

router.post('/apply', async (req, res) => {
  const { jobId } = req.body;
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'secret');
  const user = await User.findById(decoded.id);

  const job = await Job.findOne({ jobId });
  if (!job) {
    const newJob = new Job({ jobId, applied: true, user: user._id });
    await newJob.save();
    user.jobsApplied.push(newJob._id);
    await user.save();
    await sendEmail(user.email, 'Job Applied', `Applied to job ID: ${jobId}. Check: http://example.com/job${jobId}`);
  }
  res.json({ message: 'Applied' });
});

module.exports = router;