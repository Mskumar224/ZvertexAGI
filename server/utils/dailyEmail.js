const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

function scheduleDailyEmails() {
  cron.schedule('0 8 * * *', async () => {
    const users = await User.find().populate('jobsApplied');
    for (const user of users) {
      const todayJobs = user.jobsApplied.filter(job => {
        const jobDate = new Date(job.createdAt);
        const now = new Date();
        return jobDate.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
      });
      if (todayJobs.length > 0) {
        const message = todayJobs.map(job => `<li><strong>${job.title}</strong> at ${job.company} - <a href="${job.link}" style="color: #1976d2;">View Job</a></li>`).join('');
        await transporter.sendMail({
          from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
          to: user.email,
          subject: 'ZvertexAGI - Daily Job Application Summary',
          html: `
            <div style="font-family: Arial, sans-serif; color: #333;">
              <h2 style="color: #1976d2;">Daily Application Summary</h2>
              <p>Dear ${user.email},</p>
              <p>You applied to ${todayJobs.length} job(s) yesterday:</p>
              <ul>${message}</ul>
              <p>Keep up the momentum with ZvertexAGI’s automated job search tools!</p>
              <p>Best regards,<br>The ZvertexAGI Team</p>
              <hr style="border: none; border-top: 1px solid #e0e0e0;">
              <p style="font-size: 12px; color: #757575;">© 2025 ZvertexAGI. All rights reserved.</p>
            </div>
          `,
        });
      }
    }
  });
}

module.exports = { scheduleDailyEmails };