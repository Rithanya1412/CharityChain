const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Donation = require('../models/Donation');
const { auth } = require('./auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// @route   GET /api/admin/ngos
// @desc    Get all NGOs (for verification)
// @access  Private (Admin only)
router.get('/ngos', auth, isAdmin, async (req, res) => {
  try {
    const ngos = await User.find({ role: 'ngo' })
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(ngos);
  } catch (error) {
    console.error('Get NGOs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/verify-ngo/:id
// @desc    Verify an NGO
// @access  Private (Admin only)
router.put('/verify-ngo/:id', auth, isAdmin, async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    if (ngo.role !== 'ngo') {
      return res.status(400).json({ message: 'User is not an NGO' });
    }

    ngo.verified = true;
    await ngo.save();

    res.json({
      message: 'NGO verified successfully',
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        verified: ngo.verified
      }
    });
  } catch (error) {
    console.error('Verify NGO error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/reject-ngo/:id
// @desc    Reject/unverify an NGO
// @access  Private (Admin only)
router.put('/reject-ngo/:id', auth, isAdmin, async (req, res) => {
  try {
    const ngo = await User.findById(req.params.id);

    if (!ngo) {
      return res.status(404).json({ message: 'NGO not found' });
    }

    if (ngo.role !== 'ngo') {
      return res.status(400).json({ message: 'User is not an NGO' });
    }

    ngo.verified = false;
    await ngo.save();

    res.json({
      message: 'NGO verification revoked',
      ngo: {
        id: ngo._id,
        name: ngo.name,
        email: ngo.email,
        verified: ngo.verified
      }
    });
  } catch (error) {
    console.error('Reject NGO error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/campaigns
// @desc    Get all campaigns
// @access  Private (Admin only)
router.get('/campaigns', auth, isAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate('ngo', 'name email verified')
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    console.error('Get all campaigns error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/suspend-campaign/:id
// @desc    Suspend a campaign
// @access  Private (Admin only)
router.put('/suspend-campaign/:id', auth, isAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.status = 'suspended';
    await campaign.save();

    res.json({
      message: 'Campaign suspended successfully',
      campaign
    });
  } catch (error) {
    console.error('Suspend campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/admin/activate-campaign/:id
// @desc    Activate a suspended campaign
// @access  Private (Admin only)
router.put('/activate-campaign/:id', auth, isAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);

    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    campaign.status = 'active';
    await campaign.save();

    res.json({
      message: 'Campaign activated successfully',
      campaign
    });
  } catch (error) {
    console.error('Activate campaign error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/stats
// @desc    Get platform statistics
// @access  Private (Admin only)
router.get('/stats', auth, isAdmin, async (req, res) => {
  try {
    const donations = await Donation.find();
    const campaigns = await Campaign.find();
    const ngos = await User.find({ role: 'ngo', verified: true });
    const pendingNGOs = await User.find({ role: 'ngo', verified: false });

    const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
    const totalCampaigns = campaigns.length;
    const totalNGOs = ngos.length;
    const pendingVerifications = pendingNGOs.length;

    res.json({
      totalDonations,
      totalCampaigns,
      totalNGOs,
      pendingVerifications,
      activeCampaigns: campaigns.filter(c => c.status === 'active').length,
      totalDonors: donations.length // This could be improved to count unique donors
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin only)
router.get('/users', auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/admin/user/:id
// @desc    Delete a user
// @access  Private (Admin only)
router.delete('/user/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting other admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    await user.deleteOne();

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;