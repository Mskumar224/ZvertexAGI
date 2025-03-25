require('dotenv').config();
console.log('Environment Variables Loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI || 'Not set');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not set');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const jobRoutes = require('./routes/job');
const { scheduleDailyEmails } = require('./utils/dailyEmail');

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    'https://67e23ab86a51458e138e0032--zvertexagi.netlify.app',
    'https://67e2641113aab6f39709cd06--zvertexagi.netlify.app',
    'https://67e34047bb1fc30008a62bbb--zvertexagi.netlify.app', // Add your current Netlify domain
    'http://localhost:3000', // For local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Include OPTIONS for preflight
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // If you need to send cookies or auth headers
  optionsSuccessStatus: 200, // Ensure preflight returns 200
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly (optional, but ensures compatibility)
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/job', jobRoutes);

app.get('/test', (req, res) => res.send('Server is alive'));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined. Please set it in environment variables.');
  process.exit(1);
}
mongoose.set('strictQuery', true);
mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

scheduleDailyEmails();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
});