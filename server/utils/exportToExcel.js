const XLSX = require('xlsx');

async function exportDashboardToExcel(user) {
  const jobs = user.jobsApplied.map(job => ({
    JobID: job.jobId,
    Title: job.title,
    Company: job.company,
    Link: job.link,
    Applied: job.applied ? 'Yes' : 'No',
    UserEmail: user.email,
    UserPlan: user.plan,
  }));

  const ws = XLSX.utils.json_to_sheet(jobs);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Dashboard');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

module.exports = { exportDashboardToExcel };