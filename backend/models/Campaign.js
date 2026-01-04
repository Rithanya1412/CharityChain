const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['education', 'healthcare', 'environment', 'disaster-relief', 'poverty', 'other'],
    default: 'other'
  },
  targetAmount: {
    type: Number,
    required: true,
    min: 100
  },
  currentAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  donorsCount: {
    type: Number,
    default: 0,
    min: 0
  },
  ngo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'suspended', 'ended'],
    default: 'active'
  },
  endDate: {
    type: Date,
    required: true
  },
  updates: [{
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  imageUrl: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Indexes for faster queries
campaignSchema.index({ ngo: 1 });
campaignSchema.index({ status: 1 });
campaignSchema.index({ category: 1 });
campaignSchema.index({ createdAt: -1 });

// Virtual to check if campaign has ended
campaignSchema.virtual('hasEnded').get(function() {
  return new Date() > this.endDate;
});

// Virtual to calculate progress percentage
campaignSchema.virtual('progressPercentage').get(function() {
  return Math.min((this.currentAmount / this.targetAmount) * 100, 100);
});

// Ensure virtuals are included when converting to JSON
campaignSchema.set('toJSON', { virtuals: true });
campaignSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Campaign', campaignSchema);