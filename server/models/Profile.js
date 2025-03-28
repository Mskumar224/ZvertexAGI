const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  mimetype: String,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  extractedTech: String,
  extractedText: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', profileSchema);