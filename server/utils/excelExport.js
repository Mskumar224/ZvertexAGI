const ExcelJS = require('exceljs');

async function exportTrackerToExcel(user) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Job Tracker');

  worksheet.columns = [
    { header: 'User Name', key: 'userName', width: 20 },
    { header: 'User Email', key: 'userEmail', width: 30 },
    { header: 'User Phone', key: 'userPhone', width: 15 },
    { header: 'Job Title', key: 'jobTitle', width: 30 },
    { header: 'Company', key: 'company', width: 20 },
    { header: 'Job ID', key: 'jobId', width: 25 },
    { header: 'Job Link', key: 'jobLink', width: 40 },
    { header: 'Date Applied', key: 'dateApplied', width: 15 },
    { header: 'Company Contact', key: 'companyContact', width: 30 },
  ];

  user.jobsApplied.forEach(job => {
    worksheet.addRow({
      userName: user.name || 'N/A',
      userEmail: user.email,
      userPhone: user.phone || 'N/A',
      jobTitle: job.title,
      company: job.company,
      jobId: job.jobId,
      jobLink: job.link,
      dateApplied: new Date(job.createdAt).toLocaleDateString(),
      companyContact: `${job.company.toLowerCase().replace(/\s+/g, '')}@example.com`, // Placeholder
    });
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
}

module.exports = { exportTrackerToExcel };