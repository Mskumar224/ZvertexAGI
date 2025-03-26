const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');
const axios = require('axios');
const nodemailer = require('nodemailer');
const NodeCache = require('node-cache');
const serpApi = require('google-search-results-nodejs');

const JWT_SECRET = process.env.JWT_SECRET;
const SERPAPI_KEY = process.env.SERPAPI_KEY;
const jobCache = new NodeCache({ stdTTL: 600 });
const search = SERPAPI_KEY ? new serpApi.GoogleSearch(SERPAPI_KEY) : null;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

// Utility to add delay between requests
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

router.post('/upload-resume', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!req.files || !req.files.resume) {
    return res.status(400).json({ error: 'No resume uploaded' });
  }

  try {
    if (!token || typeof token !== 'string' || !token.trim()) {
      return res.status(401).json({ error: 'No valid authentication token provided' });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtError) {
      console.error('JWT error in /upload-resume:', jwtError.message);
      return res.status(401).json({ error: 'Invalid or malformed token' });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resume = req.files.resume;
    const keywords = await parseResume(resume);
    if (!keywords || keywords.length === 0) {
      return res.status(400).json({ error: 'No keywords extracted from resume' });
    }
    res.json({ keywords });
  } catch (error) {
    console.error('Error in /upload-resume:', error.message);
    res.status(500).json({ error: 'Resume parsing failed', details: error.message });
  }
});

router.post('/verify-companies', async (req, res) => {
  const { companies } = req.body;
  if (!companies || !Array.isArray(companies) || companies.length === 0) {
    return res.status(400).json({ error: 'Companies must be a non-empty array' });
  }

  try {
    const results = await Promise.all(companies.map(async (company, index) => {
      // Add a 1-second delay between requests to avoid 429
      if (index > 0) await delay(1000);
      try {
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(company + ' official website')}`, {
          timeout: 5000,
        });
        return { name: company, valid: response.status === 200, website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com` };
      } catch (error) {
        console.error(`Failed to verify ${company}:`, error.message);
        return { name: company, valid: false };
      }
    }));
    res.json({ companies: results });
  } catch (error) {
    console.error('Error in /verify-companies:', error.message);
    res.status(500).json({ error: 'Failed to verify companies', details: error.message });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { companies, technology } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!companies || !Array.isArray(companies) || !technology) {
    return res.status(400).json({ error: 'Companies (array) and technology are required' });
  }
  if (!token) {
    return res.status(401).json({ error: 'No authentication token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const cacheKey = `${user._id}-${companies.join(',')}-${technology}`;
    const cachedJobs = jobCache.get(cacheKey);
    if (cachedJobs) return res.json({ jobs: cachedJobs });

    if (!SERPAPI_KEY || !search) {
      console.error('SerpApi key missing in /fetch-jobs');
      return res.status(503).json({ error: 'Job search service unavailable due to missing API key. Please contact support.' });
    }

    const jobs = await Promise.all(companies.map(async company => {
      return new Promise((resolve) => {
        try {
          search.json({
            q: `${technology} jobs at ${company} site:${company.toLowerCase().replace(/\s+/g, '')}.com`,
            location: 'United States',
          }, (result) => {
            const job = result.organic_results?.[0] || {};
            resolve({
              id: `${company}-${Date.now()}`,
              title: job.title || `${technology} Engineer at ${company}`,
              company,
              link: job.link || `https://${company.toLowerCase().replace(/\s+/g, '')}.com/jobs/${Date.now()}`,
              requiresDocs: false,
            });
          });
        } catch (searchError) {
          console.error(`SerpApi error for ${company} in /fetch-jobs:`, searchError.message);
          resolve({
            id: `${company}-${Date.now()}`,
            title: `${technology} Engineer at ${company}`,
            company,
            link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/jobs`,
            requiresDocs: false,
            error: 'Failed to fetch job details from SerpApi',
          });
        }
      });
    }));

    const appliedJobs = await Job.find({ user: user._id }).select('jobId');
    const appliedIds = appliedJobs.map(job => job.jobId);
    const availableJobs = jobs.map(job => ({ ...job, applied: appliedIds.includes(job.id) }));

    jobCache.set(cacheKey, availableJobs);
    res.json({ jobs: availableJobs });
  } catch (error) {
    console.error('Error in /fetch-jobs:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
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

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user.jobsApplied || []);
  } catch (error) {
    console.error('Error fetching job tracker:', error.message);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    res.status(500).json({ error: 'Tracker fetch failed', details: error.message });
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