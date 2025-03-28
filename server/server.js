require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cluster = require('cluster');
const os = require('os');
const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscription');
const jobRoutes = require('./routes/job');
const zgptRoutes = require('./routes/zgpt');
const { scheduleDailyEmails } = require('./utils/dailyEmail');
const { scheduleRecurringJobs } = require('./utils/recurringJobs');
const { exportDashboardToExcel } = require('./utils/exportToExcel');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app = express();

  const corsOptions = {
    origin: ['http://localhost:3000', 'https://zvertexagi.netlify.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  app.use(cors(corsOptions));
  app.options('*', cors(corsOptions));
  app.use(express.json());
  app.use(fileUpload());

  // Log all incoming requests for debugging
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/subscription', subscriptionRoutes);
  app.use('/api/job', jobRoutes);
  app.use('/api/zgpt', zgptRoutes);
  app.get('/api/export-dashboard', exportDashboardToExcel);

  app.get('/test', (req, res) => res.send('Server is alive'));
  app.get('/health', (req, res) => res.status(200).send('OK'));

  mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.error('MongoDB error:', err.message));

  scheduleDailyEmails();
  scheduleRecurringJobs();

  const PORT = process.env.PORT || 10000;
  app.listen(PORT, '0.0.0.0', () => console.log(`Worker ${process.pid} running on port ${PORT}`));
}