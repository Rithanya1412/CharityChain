const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 1
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  blockchainHash: {
    type: String,
    default: null
  },
  transactionId: {
    type: String,
    default: null
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'crypto', 'bank_transfer', 'other'],
    default: 'card'
  },
  message: {
    type: String,
    default: null
  },
  anonymous: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes for faster queries
donationSchema.index({ donor: 1 });
donationSchema.index({ campaign: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });
donationSchema.index({ blockchainHash: 1 });

// Virtual to check if donation is verified on blockchain
donationSchema.virtual('isBlockchainVerified').get(function() {
  return this.blockchainHash !== null && this.blockchainHash !== '';
});

// Ensure virtuals are included when converting to JSON
donationSchema.set('toJSON', { virtuals: true });
donationSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Donation', donationSchema);