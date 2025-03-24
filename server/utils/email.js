const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

function sendSubscriptionEmail(email, plan) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to ZvertexAGI - Your Subscription is Active!',
    html: `
      <h2>Welcome to ZvertexAGI!</h2>
      <p>Dear ${email},</p>
      <p>Congratulations! You’ve successfully subscribed to our <strong>${plan}</strong> plan. Here’s what you can expect:</p>
      <ul>
        ${plan === 'STUDENT' ? '<li>1 Resume</li><li>45 Submissions/day</li>' : 
          plan === 'RECRUITER' ? '<li>5 Resumes</li><li>45 Submissions/day</li>' : 
          '<li>3 Recruiters</li><li>145 Submissions/day</li>'}
      </ul>
      <p>Get started by uploading your resume and applying to jobs now: <a href="${process.env.CLIENT_URL}/dashboard">${process.env.CLIENT_URL}/dashboard</a></p>
      <p>We’re excited to help you achieve your career goals!</p>
      <p>Best regards,<br/>The ZvertexAGI Team</p>
    `,
  };
  transporter.sendMail(mailOptions, (err) => { if (err) console.error(err); });
}

function sendJobApplicationEmail(email, job) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Job Application Confirmation - ZvertexAGI',
    html: `
      <h2>Application Submitted Successfully</h2>
      <p>Dear ${email},</p>
      <p>We’re pleased to confirm your application for the following position:</p>
      <ul>
        <li><strong>Position:</strong> ${job.title}</li>
        <li><strong>Company:</strong> ${job.company}</li>
        <li><strong>Job ID:</strong> ${job.id}</li>
        <li><strong>Link:</strong> <a href="${job.link}" target="_blank">${job.link}</a></li>
      </ul>
      ${job.requiresDocuments ? 
        '<p>This job requires additional documents. Please upload them via your dashboard or apply manually at the link above.</p>' : 
        '<p>Your application has been auto-submitted. Track its status in your dashboard.</p>'}
      <p>Visit your dashboard for more details: <a href="${process.env.CLIENT_URL}/dashboard">${process.env.CLIENT_URL}/dashboard</a></p>
      <p>Good luck!<br/>The ZvertexAGI Team</p>
    `,
  };
  transporter.sendMail(mailOptions, (err) => { if (err) console.error(err); });
}

module.exports = { sendSubscriptionEmail, sendJobApplicationEmail };