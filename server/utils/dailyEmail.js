const cron = require('node-cron');
const User = require('../models/User');
const Job = require('../models/Job');
const { sendEmail } = require('./email');

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
        await sendEmail(user.email, 'Daily Job Application Summary', message);
      }
      if (new Date() - new Date(user.lastReset) >= 24 * 60 * 60 * 1000) {
        user.submissionsToday = 0;
        user.lastReset = new Date();
        await user.save();
      }
    }
  });
}

module.exports = { scheduleDailyEmails };