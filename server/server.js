require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');
const { scheduleDailyEmails } = require('./utils/dailyEmail');
const { scheduleRecurringJobs } = require('./utils/recurringJobs');

const app = express();

const corsOptions = {
  origin: [
    'http://localhost:3000',          // Local development
    'https://zvertexai.netlify.app',  // Netlify deployment
    'http://zvertexai.com',           // Your current frontend domain
    'https://zvertexai.com'           // Future-proof for HTTPS
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight for all routes

app.use(express.json());
app.use(fileUpload());

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/zgpt', zgptRoutes);

app.get('/test', (req, res) => res.send('Server is alive'));
app.get('/health', (req, res) => res.status(200).send('OK'));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err.message));

scheduleDailyEmails();
scheduleRecurringJobs();

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));

// Keep server alive on Render
setInterval(() => {
  console.log('Keeping ZvertexAI server alive...');
}, 300000); // Ping every 5 minutes