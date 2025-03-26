const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

function scheduleDailyEmails() {
  cron.schedule('0 8 * * *', async () => {
    const users = await User.find().populate('jobsApplied');
    for (const user of users) {
      const todayJobs = user.jobsApplied.filter(job => {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        return jobDate.getDate() === now.getDate() - 1;
      });
      if (todayJobs.length > 0) {
        const message = `Daily Summary: You applied to ${todayJobs.length} jobs yesterday:\n` +
          todayJobs.map(job => `${job.title} at ${job.company} - ${job.link}`).join('\n');
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: user.email,
          subject: 'Daily Job Application Summary',
          text: message,
        });
      }
    }
  });
}

async function sendSubscriptionEmail(email, plan) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Subscription Confirmation',
    text: `Thank you for subscribing to the ${plan} plan! You can now access your dashboard.`,
  });
}

async function sendJobAppliedEmail(email, job) {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Job Application Confirmation',
    text: `You have successfully applied to ${job.title} at ${job.company}. Check it here: ${job.link}`,
  });
}

module.exports = { scheduleDailyEmails, sendSubscriptionEmail, sendJobAppliedEmail };