const cron = require('node-cron');
const axios = require('axios');
const User = require('../models/User');
const Job = require('../models/Job');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

function scheduleRecurringJobs() {
  cron.schedule('*/30 * * * *', async () => {
    const users = await User.find().populate('jobsApplied');
    for (const user of users) {
      if (user.selectedCompanies && user.selectedTechnology) {
        const companies = user.selectedCompanies;
        const technology = user.selectedTechnology;

        const jobs = companies.flatMap(company => [
          { id: `${company}-${Date.now()}-1`, title: `${technology} Engineer at ${company}`, company, link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/jobs/${Date.now()}-1`, requiresDocs: false },
        ]);

        const appliedJobs = await Job.find({ user: user._id }).select('jobId');
        const appliedIds = appliedJobs.map(job => job.jobId);

        for (const job of jobs) {
          if (!appliedIds.includes(job.jobId)) {
            const newJob = new Job({ jobId: job.id, title: job.title, company: job.company, link: job.link, applied: true, user: user._id, requiresDocs: job.requiresDocs });
            await newJob.save();
            user.jobsApplied.push(newJob._id);
            await user.save();

            await transporter.sendMail({
              from: process.env.EMAIL_USER,
              to: user.email,
              subject: 'Auto-Apply Confirmation',
              text: `We’ve auto-applied you to ${job.title} at ${job.company}. Job ID: ${job.id}. View details: ${job.link}`,
            });
          }
        }
      }
    }
  });
}

module.exports = { scheduleRecurringJobs };