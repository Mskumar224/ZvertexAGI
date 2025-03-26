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
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
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
      from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
      to: user.email,
      subject: 'ZvertexAGI - Job Application Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Job Application Confirmed</h2>
          <p>Dear ${user.email},</p>
          <p>We’re pleased to confirm your application for the following position:</p>
          <ul>
            <li><strong>Position:</strong> ${title}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Job ID:</strong> ${jobId}</li>
            <li><strong>Details:</strong> <a href="${link}" style="color: #1976d2;">View Job</a></li>
          </ul>
          <p>Your application has been successfully submitted. We’ll keep you updated on your job search journey!</p>
          <p>Best regards,<br>The ZvertexAGI Team</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 12px; color: #757575;">© 2025 ZvertexAGI. All rights reserved.</p>
        </div>
      `,
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

router.post('/send-confirmation', async (req, res) => {
  const { email, title, company, jobId, link } = req.body;
  try {
    await transporter.sendMail({
      from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
      to: email,
      subject: 'ZvertexAGI - Document Upload and Auto-Apply Confirmation',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Application Successfully Auto-Applied</h2>
          <p>Dear ${email},</p>
          <p>We’ve received your ID and Visa documents and have automatically applied for you to the following position:</p>
          <ul>
            <li><strong>Position:</strong> ${title}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Job ID:</strong> ${jobId}</li>
            <li><strong>Details:</strong> <a href="${link}" style="color: #1976d2;">View Job</a></li>
          </ul>
          <p>Your application is now in progress. Thank you for trusting ZvertexAGI with your career goals!</p>
          <p>Best regards,<br>The ZvertexAGI Team</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0;">
          <p style="font-size: 12px; color: #757575;">© 2025 ZvertexAGI. All rights reserved.</p>
        </div>
      `,
    });
    res.json({ message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send confirmation email' });
  }
});

module.exports = router;