require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const jobRoutes = require('./routes/job');
const { scheduleDailyEmails } = require('./utils/dailyEmail');
const { scheduleRecurringJobs } = require('./utils/recurringJobs');

const app = express();

const corsOptions = {
  origin: ['https://zvertexagi.netlify.app', 'http://localhost:3000'], // Netlify first, then local dev
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies/authorization headers
  optionsSuccessStatus: 204, // Standard response for preflight success
};

// Apply CORS middleware globally (handles preflight OPTIONS requests automatically)
app.use(cors(corsOptions));

app.use(express.json());
app.use(fileUpload());

app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/job', jobRoutes);

app.get('/test', (req, res) => res.send('Server is alive'));

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB error:', err.message));

scheduleDailyEmails();
scheduleRecurringJobs();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));