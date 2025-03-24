const mongoose = require('mongoose');

const jobApplicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  jobId: { type: String, required: true },
  position: String,
  company: String,
  jobLink: String,
  status: { type: String, default: 'Applied' },
  requiresDocuments: Boolean,
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('JobApplication', jobApplicationSchema);