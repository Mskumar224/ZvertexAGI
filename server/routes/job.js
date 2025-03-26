const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Job = require('../models/Job');
const jwt = require('jsonwebtoken');
const { parseResume } = require('../utils/resumeParser');
const { sendJobAppliedEmail } = require('../server');
const axios = require('axios');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Configure axios with a timeout
const axiosInstance = axios.create({
  timeout: 10000, // 10 seconds timeout
});

router.post('/fetch-jobs', async (req, res) => {
  const { companies, keywords } = req.body;
  try {
    const jobs = [];
    for (const company of companies) {
      try {
        // Replace with a real job API (e.g., Indeed, LinkedIn Jobs)
        const response = await axiosInstance.get(
          `https://api.example.com/jobs?company=${encodeURIComponent(company)}&keywords=${encodeURIComponent(keywords.join(','))}`
        );
        jobs.push(...response.data.map(job => ({
          id: job.id,
          title: job.title,
          company,
          link: job.url,
          applied: false,
          requiresDocs: job.requiresDocs || false,
        })));
      } catch (error) {
        console.error(`Failed to fetch jobs for ${company}:`, error.message);
        // Continue with other companies instead of failing the entire request
      }
    }
    res.json({ jobs });
  } catch (error) {
    console.error('Fetch Jobs Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs', details: error.message });
  }
});

// Other routes (upload-resume, tracker, apply) remain unchanged for this fix
router.post('/upload-resume', async (req, res) => { /* ... */ });
router.get('/tracker', async (req, res) => { /* ... */ });
router.post('/apply', async (req, res) => { /* ... */ });

module.exports = router;