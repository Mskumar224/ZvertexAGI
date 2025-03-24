const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscription: {
    plan: { type: String, enum: ['STUDENT', 'RECRUITER', 'BUSINESS'] },
    resumes: Number,
    submissions: Number,
    recruiters: Number,
  },
});

module.exports = mongoose.model('User', userSchema);