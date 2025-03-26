const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Add bcrypt in production
  subscription: { type: String, default: 'NONE' },
  resumes: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
});

module.exports = mongoose.model('User', userSchema);