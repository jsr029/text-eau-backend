const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['superAdmin', 'admin', 'user'], default: 'user' },
  company: { type: String }, // For client tables
  googleId: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
