const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Use bcrypt in production
  subscription: { type: String, default: 'NONE' },
  payLater: { type: Boolean, default: false }, // New: Track Pay Later status
  resumes: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  resumesUploaded: { type: Number, default: 0 },
  submissionsToday: { type: Number, default: 0 },
  lastReset: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);