const express = require('express');
const router = express.Router();
const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const { auth } = require('./auth');

// @route   POST /api/donations
// @desc    Create a new donation
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { campaignId, amount } = req.body;

    // Validation
    if (!campaignId || !amount) {
      return res.status(400).json({ message: 'Please provide campaign and amount' });
    }

    if (amount <= 0) {
      return res.status(400).json({ message: 'Amount must be greater than 0' });
    }

    // Check if campaign exists
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign is active
    if (campaign.status !== 'active') {
      return res.status(400).json({ message: 'This campaign is not accepting donations' });
    }

    // Create donation
    const donation = new Donation({
      donor: req.user._id,
      campaign: campaignId,
      amount: parseFloat(amount),
      status: 'completed',
      blockchainHash: generateBlockchainHash() // Simulate blockchain hash
    });

    await donation.save();

    // Update campaign stats
    campaign.currentAmount += parseFloat(amount);
    campaign.donorsCount += 1;
    await campaign.save();

    const populatedDonation = await Donation.findById(donation._id)
      .populate('donor', 'name email')
      .populate('campaign', 'title ngo');

    res.status(201).json({
      message: 'Donation successful',
      donation: populatedDonation
    });
  } catch (error) {
    console.error('Donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/my-donations
// @desc    Get donations made by logged-in user
// @access  Private
router.get('/my-donations', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id })
      .populate('campaign', 'title description category ngo')
      .populate({
        path: 'campaign',
        populate: {
          path: 'ngo',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Get my donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/stats
// @desc    Get donation statistics for logged-in user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const donations = await Donation.find({ donor: req.user._id });

    const totalDonated = donations.reduce((sum, donation) => sum + donation.amount, 0);
    
    const uniqueCampaigns = [...new Set(donations.map(d => d.campaign.toString()))];
    const campaignsSupported = uniqueCampaigns.length;

    // Calculate impact score (simple formula: $10 = 1 point)
    const impactScore = Math.floor(totalDonated / 10);

    res.json({
      totalDonated,
      campaignsSupported,
      impactScore,
      totalDonations: donations.length
    });
  } catch (error) {
    console.error('Get donation stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/donations/:id
// @desc    Get single donation by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('campaign', 'title description ngo');

    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }

    // Check if user is the donor or the NGO that owns the campaign
    const campaign = await Campaign.findById(donation.campaign._id);
    if (
      donation.donor._id.toString() !== req.user._id.toString() &&
      campaign.ngo.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(donation);
  } catch (error) {
    console.error('Get donation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to simulate blockchain hash
function generateBlockchainHash() {
  const characters = '0123456789abcdef';
  let hash = '0x';
  for (let i = 0; i < 64; i++) {
    hash += characters[Math.floor(Math.random() * characters.length)];
  }
  return hash;
}

module.exports = router;