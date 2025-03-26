const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER || 'zvertexai@honotech.com',
    pass: process.env.EMAIL_PASS || 'qnfz cudq ytwe vjwp',
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error.message);
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

function scheduleDailyEmails() {
  cron.schedule('0 8 * * *', async () => {
    try {
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
            from: '"ZvertexAGI" <zvertexai@honotech.com>',
            to: user.email,
            subject: 'Daily Job Application Summary',
            text: message,
          });
          console.log(`Daily summary sent to ${user.email}`);
        }
      }
    } catch (error) {
      console.error('Daily Email Error:', error.message);
    }
  });
}

async function sendSubscriptionEmail(email, plan) {
  try {
    await transporter.sendMail({
      from: '"ZvertexAGI" <zvertexai@honotech.com>',
      to: email,
      subject: 'Subscription Confirmation',
      text: `Thank you for subscribing to the ${plan} plan! You can now access your dashboard.`,
    });
    console.log(`Subscription email sent to ${email} for ${plan} plan`);
  } catch (error) {
    console.error('Subscription Email Error:', error.message);
    throw error; // Re-throw to be caught by the caller
  }
}

async function sendJobAppliedEmail(email, job) {
  try {
    await transporter.sendMail({
      from: '"ZvertexAGI" <zvertexai@honotech.com>',
      to: email,
      subject: 'Job Application Confirmation',
      text: `You have successfully applied to ${job.title} at ${job.company}. Check it here: ${job.link}`,
    });
    console.log(`Job application email sent to ${email} for job ${job.jobId}`);
  } catch (error) {
    console.error('Job Applied Email Error:', error.message);
    throw error; // Re-throw to be caught by the caller
  }
}

module.exports = { scheduleDailyEmails, sendSubscriptionEmail, sendJobAppliedEmail };