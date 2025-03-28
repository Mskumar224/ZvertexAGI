const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  phone: String,
  subscription: { type: String, default: 'NONE' },
  resumes: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  profiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Profile' }],
  selectedCompanies: [{ type: String }],
  selectedTechnology: { type: String },
  selectedProfile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  recruiters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', userSchema);