const XLSX = require('xlsx');
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');

async function exportDashboardToExcel(req, res) {
  const token = req.headers.authorization?.split('Bearer ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).populate('jobsApplied profiles');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const jobs = await Job.find({ user: user._id }).populate('profile');
    const data = jobs.map(job => ({
      'User Name': user.name || 'N/A',
      'User Email': user.email,
      'User Phone': user.phone || 'N/A',
      'Job Title': job.title,
      'Company': job.company,
      'Job ID': job.jobId,
      'Link': job.link,
      'Applied Date': job.createdAt.toISOString(),
      'Profile Used': job.profile ? job.profile.filename : 'Basic Apply',
      'Company Contact': `contact@${job.company.toLowerCase().replace(/\s+/g, '')}.com`, // Placeholder
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', 'attachment; filename=dashboard.xlsx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
}

module.exports = { exportDashboardToExcel };