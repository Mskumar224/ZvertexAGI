const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  subscription: { type: String, default: 'NONE' },
  resumes: { type: Number, default: 0 },
  submissions: { type: Number, default: 0 },
  jobsApplied: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
  selectedCompanies: [{ type: String }],
  selectedTechnology: { type: String },
});

module.exports = mongoose.model('User', userSchema);