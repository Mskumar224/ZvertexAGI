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
    'https://67e2d3beb8e0310008311921--zvertexagi.netlify.app', // Latest origin
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

// Middleware
app.use(express.json());
app.use(fileUpload());

// Routes
app.use('/api/auth', (req, res, next) => {
  console.log('Request to /api/auth:', req.method, req.url);
  next();
}, authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/job', jobRoutes);

app.get('/test', (req, res) => res.send('Server is alive'));

// MongoDB connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('MONGO_URI is not defined. Please set it in environment variables.');
  process.exit(1);
} else {
  mongoose.set('strictQuery', true);
  mongoose
    .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => {
      console.error('MongoDB connection error:', err.message);
      process.exit(1);
    });
}

scheduleDailyEmails();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});