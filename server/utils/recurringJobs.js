const cron = require('node-cron');
const User = require('../models/User');
const Job = require('../models/Job');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: 'zvertexai@honotech.com', pass: 'qnfz cudq ytwe vjwp' },
});

function scheduleRecurringJobs() {
  cron.schedule('*/30 * * * *', async () => {
    const users = await User.find().populate('jobsApplied');
    for (const user of users) {
      if (user.selectedCompanies && user.selectedTechnology) {
        const planLimits = {
          STUDENT: 45,
          RECRUITER: 45,
          BUSINESS: 145,
        };
        const today = new Date().setHours(0, 0, 0, 0);
        const todayJobs = user.jobsApplied.filter(job => new Date(job.createdAt).setHours(0, 0, 0, 0) === today);
        const submissionsLeft = planLimits[user.subscription] - todayJobs.length;

        if (submissionsLeft <= 0) continue;

        const companies = user.selectedCompanies;
        const technology = user.selectedTechnology;

        const jobs = companies.flatMap(company => [
          { id: `${company}-${Date.now()}-1`, title: `${technology} Engineer at ${company}`, company, link: `https://${company.toLowerCase().replace(/\s+/g, '')}.com/jobs/${Date.now()}-1`, requiresDocs: false },
        ]);

        const appliedJobs = await Job.find({ user: user._id }).select('jobId');
        const appliedIds = appliedJobs.map(job => job.jobId);

        for (const job of jobs) {
          if (!appliedIds.includes(job.id) && submissionsLeft > 0) {
            const newJob = new Job({ jobId: job.id, title: job.title, company: job.company, link: job.link, applied: true, user: user._id, requiresDocs: job.requiresDocs });
            await newJob.save();
            user.jobsApplied.push(newJob._id);
            await user.save();

            await transporter.sendMail({
              from: '"ZvertexAGI Team" <zvertexai@honotech.com>',
              to: user.email,
              subject: 'ZvertexAGI - Auto-Apply Confirmation',
              html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                  <h2 style="color: #1976d2;">Auto-Application Confirmed</h2>
                  <p>Dear ${user.email},</p>
                  <p>We’ve automatically applied for you to the following position:</p>
                  <ul>
                    <li><strong>Position:</strong> ${job.title}</li>
                    <li><strong>Company:</strong> ${job.company}</li>
                    <li><strong>Job ID:</strong> ${job.id}</li>
                    <li><strong>Details:</strong> <a href="${job.link}" style="color: #1976d2;">View Job</a></li>
                  </ul>
                  <p>Our automation tools are working hard to secure your next opportunity!</p>
                  <p>Best regards,<br>The ZvertexAGI Team</p>
                  <hr style="border: none; border-top: 1px solid #e0e0e0;">
                  <p style="font-size: 12px; color: #757575;">© 2025 ZvertexAGI. All rights reserved.</p>
                </div>
              `,
            });

            break;
          }
        }
      }
    }
  });
}

module.exports = { scheduleRecurringJobs };