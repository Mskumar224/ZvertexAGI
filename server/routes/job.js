const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

router.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const { file } = req.files;
  const { description, userId } = req.body;

  try {
    const profile = new Profile({
      filename: file.name,
      data: file.data,
      mimetype: file.mimetype,
      description,
      user: userId,
    });
    await profile.save();

    const user = await User.findById(userId);
    user.profiles.push(profile._id);
    await user.save();

    res.json({ message: 'File uploaded successfully', profileId: profile._id });
  } catch (error) {
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

router.post('/apply', async (req, res) => {
  const { technology, companies, autoApplyType, profileDetails } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!technology || !companies || companies.length === 0) {
    return res.status(400).json({ message: 'Technology and at least one company are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.selectedTechnology = technology;
    user.selectedCompanies = companies;
    if (autoApplyType === 'full' && profileDetails) {
      user.profileDetails = profileDetails;
    }
    await user.save();

    res.json({ message: 'Job preferences saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save preferences', error: error.message });
  }
});

router.post('/manual-apply', async (req, res) => {
  const { jobId, title, company, link, profileId } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('profiles');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const job = new Job({
      jobId,
      title,
      company,
      link,
      applied: true,
      user: user._id,
      profile: profileId,
      requiresDocs: !!profileId,
    });
    await job.save();
    user.jobsApplied.push(job._id);
    await user.save();

    const emailBody = profileId
      ? `
        <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
          <h2 style="color: #1976d2;">Application Submitted with Profile</h2>
          <p>Dear ${user.name || user.email},</p>
          <p>We’ve applied for you to:</p>
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
          <h2 style="color: #1976d2;">Application Submitted</h2>
          <p>Dear ${user.name || user.email},</p>
          <p>We’ve applied for you to:</p>
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

    res.json({ message: 'Job applied successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Application failed', error: error.message });
  }
});

router.get('/user-jobs', async (req, res) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user.jobsApplied);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
});

module.exports = router;