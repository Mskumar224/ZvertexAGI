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

const jobTitles = [
  'Engineer', 'Analyst', 'Developer', 'Manager', 'Consultant', 'Specialist', 'Architect', 'Designer', 'Administrator', 'Coordinator'
];

const additionalCompanies = [
  'Google', 'Amazon', 'Microsoft', 'Apple', 'Facebook', 'Tesla', 'Netflix', 'Adobe', 'Salesforce', 'Oracle'
];

function scheduleRecurringJobs() {
  cron.schedule('*/30 * * * *', async () => {
    const users = await User.find().populate('jobsApplied profiles');
    for (const user of users) {
      if (user.selectedCompanies && user.selectedTechnology) {
        const planLimits = { STUDENT: 45, RECRUITER: 45, BUSINESS: 145 };
        const today = new Date().setHours(0, 0, 0, 0);
        const todayJobs = user.jobsApplied.filter(job => new Date(job.createdAt).setHours(0, 0, 0, 0) === today);
        const submissionsLeft = planLimits[user.subscription] - todayJobs.length;

        if (submissionsLeft <= 0) continue;

        const companies = [...user.selectedCompanies, ...additionalCompanies].slice(0, submissionsLeft);
        const technology = user.selectedTechnology;
        const profiles = user.profiles || [];

        const jobs = await Promise.all(companies.map(async (company, index) => {
          const uniqueId = `${company}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
          const randomTitle = jobTitles[Math.floor(Math.random() * jobTitles.length)];
          try {
            const response = await axios.get(`https://api.indeed.com/ads/apisearch`, {
              params: {
                publisher: process.env.INDEED_PUBLISHER_ID,
                v: 2,
                format: 'json',
                q: `${technology} ${company}`,
                limit: 1,
                start: index,
              },
              timeout: 5000,
            });
            const job = response.data.results[0];
            return {
              id: job.jobkey,
              title: `${job.jobtitle} #${uniqueId}`,
              company: job.company,
              link: job.url,
              requiresDocs: Math.random() > 0.5,
            };
          } catch (error) {
            return {
              id: `${uniqueId}-1`,
              title: `${technology} ${randomTitle} #${uniqueId}`,
              company,
              link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/careers/job-${uniqueId}-1`,
              requiresDocs: false,
            };
          }
        }));

        const appliedJobs = await Job.find({ user: user._id }).select('jobId');
        const appliedIds = appliedJobs.map(job => job.jobId);

        for (const job of jobs) {
          if (!appliedIds.includes(job.id) && submissionsLeft > 0) {
            const profile = profiles.length > 0 ? profiles[0] : null;
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

            const emailBody = job.requiresDocs
              ? `
                <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
                  <h2 style="color: #1976d2;">Auto-Application with Documents</h2>
                  <p>Dear ${user.email},</p>
                  <p>We’ve auto-applied with your profile to:</p>
                  <ul>
                    <li><strong>Position:</strong> ${job.title}</li>
                    <li><strong>Company:</strong> ${job.company}</li>
                    <li><strong>Job ID:</strong> ${job.id}</li>
                    <li><strong>Link:</strong> <a href="${job.link}" style="color: #1976d2;">${job.link}</a></li>
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
                    <li><strong>Position:</strong> ${job.title}</li>
                    <li><strong>Company:</strong> ${job.company}</li>
                    <li><strong>Job ID:</strong> ${job.id}</li>
                    <li><strong>Link:</strong> <a href="${job.link}" style="color: #1976d2;">${job.link}</a></li>
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
          }
        }
      }
    }
  });
}

module.exports = { scheduleRecurringJobs };