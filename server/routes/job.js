const express = require('express');
const auth = require('../middleware/auth');
const JobApplication = require('../models/JobApplication');
const User = require('../models/User');
const { verifyCompany } = require('../utils/companyDetector');
const { sendJobApplicationEmail } = require('../utils/email');
const router = express.Router();

router.post('/verify-company', auth, async (req, res) => {
  const { company } = req.body;
  try {
    const valid = await verifyCompany(company);
    res.json({ valid });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/apply', auth, async (req, res) => {
  const { companies, technologies } = req.body;
  try {
    const user = await User.findById(req.user.userId);
    if (!user.subscription) return res.status(400).json({ msg: 'No active subscription' });

    const today = new Date().setHours(0, 0, 0, 0);
    const applicationsToday = await JobApplication.countDocuments({
      userId: user._id,
      appliedAt: { $gte: today },
    });
    if (applicationsToday >= user.subscription.submissions) {
      return res.status(400).json({ msg: 'Daily submission limit reached' });
    }

    const jobs = await fetchJobs(companies, technologies);
    const applications = [];

    for (const job of jobs) {
      if (applicationsToday + applications.length >= user.subscription.submissions) break;

      const existing = await JobApplication.findOne({ userId: user._id, jobId: job.id });
      if (existing) continue;

      const application = new JobApplication({
        userId: user._id,
        jobId: job.id,
        position: job.title,
        company: job.company,
        jobLink: job.link,
        requiresDocuments: job.requiresDocuments,
      });

      if (job.requiresDocuments) {
        application.status = 'Pending Documents';
      } else {
        await applyToJob(job);
        sendJobApplicationEmail(user.email, job);
      }

      await application.save();
      applications.push(application);
    }

    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/applications', auth, async (req, res) => {
  try {
    const applications = await JobApplication.find({ userId: req.user.userId }).sort({ appliedAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

async function sendDailySummary() {
  const users = await User.find();
  const today = new Date().setHours(0, 0, 0, 0);
  for (const user of users) {
    const applications = await JobApplication.find({
      userId: user._id,
      appliedAt: { $gte: today },
    });
    if (applications.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Your Daily Job Application Summary - ZvertexAGI',
        html: `
          <h2>Daily Application Summary</h2>
          <p>Dear ${user.email},</p>
          <p>You've applied to ${applications.length} jobs today. Here are the details:</p>
          <ul>
            ${applications.map(app => `<li>${app.position} at ${app.company} - <a href="${app.jobLink}" target="_blank">View Job</a></li>`).join('')}
          </ul>
          <p>Keep up the momentum! Visit your dashboard to track your applications: <a href="${process.env.CLIENT_URL}/dashboard">${process.env.CLIENT_URL}/dashboard</a></p>
          <p>Best regards,<br/>The ZvertexAGI Team</p>
        `,
      };
      transporter.sendMail(mailOptions, (err) => {
        if (err) console.error(err);
      });
    }
  }
}

async function fetchJobs(companies, technologies) {
  return companies.flatMap(company => technologies.map(tech => ({
    id: `job_${Math.random().toString(36).substr(2, 9)}`,
    title: `${tech} Developer`,
    company,
    link: `https://${company.toLowerCase().replace(/\s/g, '')}.com/jobs/${tech}-${Math.random().toString(36).substr(2, 9)}`,
    requiresDocuments: Math.random() > 0.5,
  })));
}

async function applyToJob(job) {
  console.log(`Applying to ${job.title} at ${job.company}`);
}

// Export both router and sendDailySummary
module.exports = { router, sendDailySummary };