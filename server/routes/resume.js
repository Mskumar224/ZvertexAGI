const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const auth = require('../middleware/auth');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileBuffer = req.file.buffer;
    let text;

    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(fileBuffer);
      text = data.text;
    } else if (req.file.mimetype === 'text/plain') {
      text = fileBuffer.toString('utf8');
    } else if (req.file.mimetype === 'application/msword' || req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      const result = await mammoth.extractRawText({ buffer: fileBuffer });
      text = result.value;
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    const keywords = extractKeywords(text);
    res.json({ keywords });
  } catch (err) {
    console.error('Server error:', err.message);
    res.status(500).json({ error: 'Failed to process resume', details: err.message });
  }
});

function extractKeywords(text) {
  const words = text.toLowerCase().split(/\W+/);
  const techKeywords = [
    'javascript', 'python', 'java', 'react', 'node', 'angular', 'vue', 'sql', 'mongodb', 'aws',
    'docker', 'kubernetes', 'typescript', 'csharp', 'php', 'ruby', 'swift', 'kotlin', 'go', 'rust',
  ];
  return words.filter(word => techKeywords.includes(word)).slice(0, 10);
}

module.exports = router;