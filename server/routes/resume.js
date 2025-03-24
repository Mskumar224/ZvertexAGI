const express = require('express');
const multer = require('multer');
const textract = require('textract');
const auth = require('../middleware/auth');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', auth, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Extract text based on file type
    const buffer = req.file.buffer;
    const fileName = req.file.originalname;

    // Use textract to handle various formats
    textract.fromBufferWithName(fileName, buffer, (err, text) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to parse document: ' + err.message });
      }
      const keywords = extractKeywords(text || '');
      res.json({ keywords });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
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