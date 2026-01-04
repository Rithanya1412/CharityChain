const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const { auth } = require('./auth');

// Middleware to check if user is NGO
const isNGO = (req, res, next) => {
  if (req.user.role !== 'ngo') {
    return res.status(403).json({ message: 'Access denied. NGO role required.' });
  }
  next();
};

// @route   GET /api/campaigns
// @desc    Get all active campaigns
// @access  Public
router.get('/', async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' })
      .populate('ngo', 'name email verified')
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    console.error('Get campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/campaigns/:id
// @desc    Get single campaign by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('ngo', 'name email verified registrationNumber');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (error) {
    console.error('Get campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/campaigns/my-campaigns
// @desc    Get campaigns created by logged-in NGO
// @access  Private (NGO only)
router.get('/my-campaigns', auth, isNGO, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ ngo: req.user._id })
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    console.error('Get my campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns
// @desc    Create a new campaign
// @access  Private (NGO only)
router.post('/', auth, isNGO, async (req, res) => {
  try {
    const { title, description, category, targetAmount, endDate } = req.body;

    // Validation
    if (!title || !description || !category || !targetAmount || !endDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (targetAmount < 100) {
      return res.status(400).json({ message: 'Target amount must be at least $100' });
    }

    const campaign = new Campaign({
      title,
      description,
      category,
      targetAmount,
      endDate,
      ngo: req.user._id,
      status: 'active',
      currentAmount: 0,
      donorsCount: 0
    });

    await campaign.save();

    const populatedCampaign = await Campaign.findById(campaign._id)
      .populate('ngo', 'name email verified');

    res.status(201).json({
      message: 'Campaign created successfully',
      campaign: populatedCampaign
    });
  } catch (error) {
    console.error('Create campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/campaigns/:id
// @desc    Update a campaign
// @access  Private (NGO only - own campaigns)
router.put('/:id', auth, isNGO, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign belongs to this NGO
    if (campaign.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    const { title, description, category, targetAmount, endDate } = req.body;

    if (title) campaign.title = title;
    if (description) campaign.description = description;
    if (category) campaign.category = category;
    if (targetAmount) campaign.targetAmount = targetAmount;
    if (endDate) campaign.endDate = endDate;

    await campaign.save();

    const updatedCampaign = await Campaign.findById(campaign._id)
      .populate('ngo', 'name email verified');

    res.json({
      message: 'Campaign updated successfully',
      campaign: updatedCampaign
    });
  } catch (error) {
    console.error('Update campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/campaigns/:id/updates
// @desc    Post an update to a campaign
// @access  Private (NGO only - own campaigns)
router.post('/:id/updates', auth, isNGO, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    // Check if campaign belongs to this NGO
    if (campaign.ngo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this campaign' });
    }

    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    campaign.updates.push({
      title,
      content,
      date: new Date()
    });

    await campaign.save();

    res.json({
      message: 'Update posted successfully',
      campaign
    });
  } catch (error) {
    console.error('Post update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/campaigns/:id/updates
// @desc    Get all updates for a campaign
// @access  Public
router.get('/:id/updates', async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id).select('updates');

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign.updates || []);
  } catch (error) {
    console.error('Get updates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/campaigns/:id/donations
// @desc    Get all donations for a campaign
// @access  Public
router.get('/:id/donations', async (req, res) => {
  try {
    const Donation = require('../models/Donation');
    
    const donations = await Donation.find({ campaign: req.params.id })
      .populate('donor', 'name')
      .sort({ createdAt: -1 });

    res.json(donations);
  } catch (error) {
    console.error('Get campaign donations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;