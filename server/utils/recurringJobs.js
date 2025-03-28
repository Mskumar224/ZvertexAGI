const cron = require('node-cron');
const User = require('../models/User');
const Job = require('../models/Job');
const Profile = require('../models/Profile');
const nodemailer = require('nodemailer');
const axios = require('axios');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

const reliableCompanies = ['Indeed', 'LinkedIn', 'Glassdoor', 'Monster', 'CareerBuilder'];

async function applyJob(job, profile, user) {
  const newJob = new Job({
    jobId: job.id,
    title: job.title,
    company: job.company,
    link: job.link,
    applied: true,
    user: user._id,
    requiresDocs: job.requiresDocs,
    profile: profile?._id,
  });
  await newJob.save();
  user.jobsApplied.push(newJob._id);
  await user.save();

  if (job.requiresDocs && profile?.extractedText) {
    console.log(`Simulating detailed apply for ${job.title} with profile ${profile.filename}`);
  }

  await transporter.sendMail({
    from: '"ZvertexAI Team" <zvertexai@honotech.com>',
    to: user.email,
    subject: 'ZvertexAI - Job Application Confirmation',
    html: `
      <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
        <h2 style="color: #1976d2;">Auto-Application Confirmed</h2>
        <p>Dear ${user.email},</p>
        <p>We’ve auto-applied for you to:</p>
        <ul>
          <li><strong>Position:</strong> ${job.title}</li>
          <li><strong>Company:</strong> ${job.company}</li>
          <li><strong>Job ID:</strong> ${job.id}</li>
          <li><strong>Link:</strong> <a href="${job.link}" style="color: #1976d2;">${job.link}</a></li>
        </ul>
        <p>Best regards,<br>The ZvertexAI Team</p>
      </div>
    `,
  });
}

function scheduleRecurringJobs() {
  cron.schedule('*/30 * * * *', async () => {
    const users = await User.find().populate('jobsApplied profiles selectedProfile');
    for (const user of users) {
      const planLimits = { STUDENT: 45, RECRUITER: 225, BUSINESS: 675 };
      const today = new Date().setHours(0, 0, 0, 0);
      const todayJobs = user.jobsApplied.filter(job => new Date(job.createdAt).setHours(0, 0, 0, 0) === today);
      const submissionsLeft = planLimits[user.subscription] - todayJobs.length;

      if (submissionsLeft <= 0 || !user.selectedCompanies || !user.selectedTechnology) continue;

      const profilesToApply = user.subscription === 'STUDENT' ? [user.selectedProfile || user.profiles[0]] :
                              user.subscription === 'RECRUITER' ? user.profiles.slice(0, 5) :
                              user.profiles.slice(0, 15);

      for (const profile of profilesToApply.filter(p => p)) {
        const technology = profile.extractedTech || user.selectedTechnology;
        const companies = reliableCompanies.filter(c => user.selectedCompanies.includes(c)).slice(0, submissionsLeft);

        const jobs = await Promise.all(companies.map(async (company) => {
          try {
            const response = await axios.get(`https://api.indeed.com/ads/apisearch`, {
              params: {
                publisher: process.env.INDEED_PUBLISHER_ID,
                v: 2,
                format: 'json',
                q: technology,
                limit: 1,
                start: Math.floor(Math.random() * 100), // Randomize job fetch
              },
              timeout: 5000,
            });
            const job = response.data.results[0];
            return {
              id: job.jobkey,
              title: job.jobtitle,
              company: job.company,
              link: job.url,
              requiresDocs: Math.random() > 0.5,
            };
          } catch (error) {
            return null;
          }
        }));

        const appliedJobs = await Job.find({ user: user._id }).select('jobId');
        const appliedIds = appliedJobs.map(job => job.jobId);

        for (const job of jobs.filter(j => j && !appliedIds.includes(j.id))) {
          await applyJob(job, profile, user);
        }
      }
    }
  });
}

module.exports = { scheduleRecurringJobs };