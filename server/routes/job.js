const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');
const axios = require('axios');
const nodemailer = require('nodemailer');
const XLSX = require('xlsx');

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
    res.status(500).json({ error: 'Resume parsing failed', details: error.message });
  }
});

router.post('/upload-profile', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  const { name, phone, education, experience } = req.body;
  const files = req.files || {};

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profile = new Profile({
      user: user._id,
      name,
      phone,
      education,
      experience,
      resume: files.resume ? files.resume.data : null,
      idDoc: files.idDoc ? files.idDoc.data : null,
      visaDoc: files.visaDoc ? files.visaDoc.data : null,
    });
    await profile.save();
    user.profiles = user.profiles || [];
    user.profiles.push(profile._id);
    await user.save();
    res.json({ message: 'Profile uploaded successfully', profileId: profile._id });
  } catch (error) {
    res.status(500).json({ error: 'Profile upload failed', details: error.message });
  }
});

router.post('/verify-companies', async (req, res) => {
  const { companies } = req.body;
  const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
  try {
    const results = await Promise.all(companies.map(async (company, index) => {
      if (index > 0) await delay(1000);
      try {
        const response = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(company + ' careers')}`, { timeout: 5000 });
        return { name: company, valid: response.status === 200, website: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers` };
      } catch (error) {
        return { name: company, valid: false };
      }
    }));
    res.json({ companies: results });
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify companies', details: error.message });
  }
});

router.post('/fetch-jobs', async (req, res) => {
  const { companies, technology } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const jobs = await Promise.all(companies.map(async company => {
      try {
        const response = await axios.get(`https://api.indeed.com/ads/apisearch`, {
          params: {
            publisher: process.env.INDEED_PUBLISHER_ID, // Add to .env
            v: 2,
            format: 'json',
            q: `${technology} ${company}`,
            limit: 2,
          },
          timeout: 5000,
        });
        return response.data.results.map(job => ({
          id: job.jobkey,
          title: job.jobtitle,
          company: job.company,
          link: job.url,
          requiresDocs: Math.random() > 0.5, // Simulate for now
        }));
      } catch (error) {
        return [
          { id: `${company}-${Date.now()}-1`, title: `${technology} Engineer`, company, link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers/job-${Date.now()}-1`, requiresDocs: false },
          { id: `${company}-${Date.now()}-2`, title: `${technology} Analyst`, company, link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers/job-${Date.now()}-2`, requiresDocs: true },
        ];
      }
    })).then(results => results.flat());

    const appliedJobs = await Job.find({ user: user._id }).select('jobId');
    const appliedIds = appliedJobs.map(job => job.jobId);
    const availableJobs = jobs.map(job => ({ ...job, applied: appliedIds.includes(job.id) }));

    res.json({ jobs: availableJobs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

router.post('/apply', async (req, res) => {
  const { jobId, company, title, link, requiresDocs, profileId } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('profiles');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const existingJob = await Job.findOne({ jobId, user: user._id });
    if (existingJob) return res.status(400).json({ error: 'Already applied' });

    const profile = profileId ? await Profile.findById(profileId) : user.profiles[0];
    const job = new Job({ jobId, title, company, link, applied: true, user: user._id, requiresDocs, profile: profile?._id });
    await job.save();
    user.jobsApplied.push(job._id);
    await user.save();

    const emailBody = requiresDocs
      ? `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Application Submitted with Documents</h2>
          <p>Dear ${user.email},</p>
          <p>Your application with additional documents has been submitted:</p>
          <ul>
            <li><strong>Position:</strong> ${title}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Job ID:</strong> ${jobId}</li>
            <li><strong>Link:</strong> <a href="${link}" style="color: #1976d2;">${link}</a></li>
          </ul>
          <p>Best regards,<br>The ZvertexAGI Team</p>
        </div>
      `
      : `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Auto-Application Confirmed</h2>
          <p>Dear ${user.email},</p>
          <p>We’ve auto-applied for you to:</p>
          <ul>
            <li><strong>Position:</strong> ${title}</li>
            <li><strong>Company:</strong> ${company}</li>
            <li><strong>Job ID:</strong> ${jobId}</li>
            <li><strong>Link:</strong> <a href="${link}" style="color: #1976d2;">${link}</a></li>
          </ul>
          <p>Best regards,<br>The ZvertexAGI Team</p>
        </div>
      `;

    await transporter.sendMail({
      from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
      to: user.email,
      subject: 'ZvertexAGI - Job Application Confirmation',
      html: emailBody,
    });

    res.json({ message: 'Applied successfully', job });
  } catch (error) {
    res.status(500).json({ error: 'Application failed', details: error.message });
  }
});

router.get('/tracker', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied profiles');
    res.json(user.jobsApplied || []);
  } catch (error) {
    res.status(500).json({ error: 'Tracker fetch failed', details: error.message });
  }
});

router.get('/export-dashboard', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied profiles');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const data = user.jobsApplied.map(job => ({
      'User Email': user.email,
      'User Name': user.name || 'N/A',
      'User Phone': user.phone || 'N/A',
      'Job Title': job.title,
      'Company': job.company,
      'Job ID': job.jobId,
      'Job Link': job.link,
      'Applied Date': new Date(job.createdAt).toLocaleDateString(),
      'Company Contact': `${job.company.toLowerCase().replace(/\s+/g, '')}@example.com`,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

    res.setHeader('Content-Disposition', 'attachment; filename="dashboard.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: 'Export failed', details: error.message });
  }
});

module.exports = router;