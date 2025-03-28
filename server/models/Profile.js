// File Location: C:\Users\satee\OneDrive\Desktop\ZvertexAGI\ZvertexAGI\server\models\Profile.js
const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  phone: String,
  education: String,
  experience: String,
  resume: Buffer,
  idDoc: Buffer,
  visaDoc: Buffer,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', profileSchema);