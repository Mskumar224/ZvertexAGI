const cron = require('node-cron');
const nodemailer = require('nodemailer');
const User = require('../models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

function scheduleDailyEmails() {
  cron.schedule('0 8 * * *', async () => {
    const users = await User.find();
    for (const user of users) {
      await transporter.sendMail({
        from: '"ZvertexAI Team" <zvertexai@honotech.com>',
        to: user.email,
        subject: 'ZvertexAI Daily Update',
        html: `
          <div style="font-family: Roboto, Arial, sans-serif; color: #333;">
            <h2 style="color: #1976d2;">Daily Update</h2>
            <p>Dear ${user.name || user.email},</p>
            <p>Here’s your daily update from ZvertexAI. Check your dashboard for job application details!</p>
            <p>Best regards,<br>The ZvertexAI Team</p>
          </div>
        `,
      });
    }
  });
}

module.exports = { scheduleDailyEmails };