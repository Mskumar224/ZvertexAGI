require('dotenv').config();
console.log('Environment Variables Loaded:');
console.log('MONGO_URI:', process.env.MONGO_URI || 'Not set');
console.log('PORT:', process.env.PORT || 'Not set');
console.log('TEST_VAR:', process.env.TEST_VAR || 'Not set');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const jobRoutes = require('./routes/job');
const { scheduleDailyEmails } = require('./utils/dailyEmail');

const app = express();

const corsOptions = {
  origin: 'https://67e23ab86a51458e138e0032--zvertexagi.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(fileUpload());
app.use('/api/auth', authRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/job', jobRoutes);

app.get('/test', (req, res) => res.send('Server is alive'));

// Fallback if MONGO_URI is undefined
const mongoUri = process.env.MONGO_URI || 'mongodb+srv://zvertex247:F8i6QLh25lDlR4vf@cluster0.p7xqu.mongodb.net/zvertexagi?retryWrites=true&w=majority';
mongoose.set('strictQuery', true);
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

scheduleDailyEmails();

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));