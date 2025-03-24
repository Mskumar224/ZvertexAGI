const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function sendSubscriptionEmail(email, plan) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Welcome to ZvertexAGI!',
    text: `Thank you for subscribing to our ${plan} plan! Start applying to jobs now at ${process.env.CLIENT_URL}/dashboard`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error(err);
  });
}

function sendJobApplicationEmail(email, job) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Job Application Confirmation',
    text: `Your application for ${job.title} at ${job.company} has been submitted!\nJob Link: ${job.link}\nJob ID: ${job.id}`,
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) console.error(err);
  });
}

module.exports = { sendSubscriptionEmail, sendJobApplicationEmail };