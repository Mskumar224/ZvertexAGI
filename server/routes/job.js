const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const XLSX = require('xlsx');

router.post('/upload', async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const { file } = req.files;
  const { description, userId } = req.body;

  try {
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      return res.status(401).json({ message: 'Invalid or expired token', error: jwtError.message });
    }

    const user = await User.findById(userId || decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let extractedText = '';
    try {
      if (file.mimetype === 'application/pdf') {
        const pdfData = await pdfParse(file.data);
        extractedText = pdfData.text;
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const result = await mammoth.extractRawText({ buffer: file.data });
        extractedText = result.value;
      } else {
        return res.status(400).json({ message: 'Unsupported file format. Please upload PDF or DOCX.' });
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      return res.status(500).json({ message: 'Failed to parse file', error: parseError.message });
    }

    const technologies = [
      'JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go', 'PHP', 'TypeScript', 
      'React', 'Node.js', 'SQL', 'AWS', 'Angular', 'Vue.js', 'Django', 'Flask', 
      'Spring', 'Kotlin', 'Swift', 'Rust', 'Scala', 'Perl', 'MATLAB', 'R'
    ];
    const detectedTechs = technologies.filter(tech => extractedText.toLowerCase().includes(tech.toLowerCase()));
    const detectedTech = detectedTechs.length > 0 ? detectedTechs[0] : 'Unknown';

    const profile = new Profile({
      filename: file.name,
      data: file.data,
      mimetype: file.mimetype,
      description,
      user: user._id,
      extractedTech: detectedTech,
      extractedText,
    });

    await profile.save();
    user.profiles.push(profile._id);
    await user.save();

    res.json({ message: 'File uploaded successfully', profileId: profile._id, detectedTech });
  } catch (error) {
    console.error('Upload endpoint error:', error);
    res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

// [Rest of the file remains unchanged]
router.post('/apply', async (req, res) => {
  const { technology, companies, profileId } = req.body;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!technology || !companies || !Array.isArray(companies)) {
      return res.status(400).json({ message: 'Invalid technology or companies data' });
    }

    user.selectedTechnology = technology;
    user.selectedCompanies = companies;
    if (profileId) user.selectedProfile = profileId;
    await user.save();

    res.json({ message: 'Job preferences saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to save preferences', error: error.message });
  }
});

router.get('/export-dashboard/:userId', async (req, res) => {
  const { userId } = req.params;
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId || decoded.id).populate('jobsApplied profiles');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['Name', 'Email', 'Phone', 'Subscription', 'Technology', 'Companies', 'Jobs Applied', 'Job ID', 'Job Title', 'Company', 'Link'],
      ...user.jobsApplied.map(job => [
        user.name,
        user.email,
        user.phone,
        user.subscription,
        user.selectedTechnology,
        user.selectedCompanies.join(', '),
        user.jobsApplied.length,
        job.jobId,
        job.title,
        job.company,
        job.link,
      ]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Dashboard');
    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Disposition', `attachment; filename="dashboard_${userId}.xlsx"`);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ message: 'Export failed', error: error.message });
  }
});

module.exports = router;