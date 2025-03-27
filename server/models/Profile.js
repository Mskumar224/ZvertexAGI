const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  resume: { type: Buffer }, // Store file as buffer
  technology: { type: String },
  companies: [{ type: String }],
});

module.exports = mongoose.model('Profile', profileSchema);