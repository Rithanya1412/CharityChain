const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['donor', 'ngo', 'admin'],
    default: 'donor'
  },
  verified: {
    type: Boolean,
    default: false
  },
  // NGO-specific fields
  registrationNumber: {
    type: String,
    sparse: true // Allows null values but ensures uniqueness when present
  },
  contactNumber: {
    type: String
  },
  website: {
    type: String
  },
  address: {
    type: String
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);