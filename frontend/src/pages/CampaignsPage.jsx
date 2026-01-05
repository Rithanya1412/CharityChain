import { API_URL } from '../config';
import { useState, useEffect } from 'react';

export default function CampaignDetails({ campaign, user, setCurrentPage }) {
  const [donationAmount, setDonationAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [donations, setDonations] = useState([]);
  const [updates, setUpdates] = useState([]);

  const quickAmounts = [10, 25, 50, 100, 250, 500];

  useEffect(() => {
    if (campaign?._id) {
      fetchCampaignDetails();
    }
  }, [campaign]);

  const fetchCampaignDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const [donationsRes, updatesRes] = await Promise.all([
        fetch(`http://localhost:5000/api/campaigns/${campaign._id}/donations`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        }),
        fetch(`http://localhost:5000/api/campaigns/${campaign._id}/updates`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
      ]);

      const donationsData = await donationsRes.json();
      const updatesData = await updatesRes.json();

      setDonations(donationsData);
      setUpdates(updatesData);
    } catch (error) {
      console.error('Error fetching campaign details:', error);
    }
  };

  const handleDonation = async () => {
    const amount = customAmount || donationAmount;
    if (!amount || amount <= 0) {
      setError('Please enter a valid donation amount');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/donations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          campaignId: campaign._id,
          amount: parseFloat(amount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setDonationAmount('');
        setCustomAmount('');
        setTimeout(() => {
          setSuccess(false);
          setShowDonationForm(false);
          fetchCampaignDetails();
        }, 3000);
      } else {
        setError(data.message || 'Donation failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const calculateProgress = () => {
    return Math.min(((campaign.currentAmount || 0) / (campaign.targetAmount || 1)) * 100, 100);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Campaign not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CharityChain</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('campaigns')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              ← Back to Campaigns
            </button>
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Campaign Header */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                {campaign.category?.replace('-', ' ').toUpperCase() || 'GENERAL'}
              </span>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{campaign.title}</h1>
              <p className="text-gray-600 mb-4">
                Organized by <span className="font-medium text-blue-600">{campaign.ngo?.name || 'Unknown NGO'}</span>
              </p>

              {/* Campaign Image */}
              <div className="h-64 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-24 h-24 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ${campaign.currentAmount?.toLocaleString() || 0}
                  </span>
                  <span className="text-gray-600">
                    goal: ${campaign.targetAmount?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 h-4 rounded-full"
                    style={{ width: `${calculateProgress()}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{campaign.donorsCount || 0} donors</span>
                  <span>{Math.round(calculateProgress())}% funded</span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About this campaign</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {campaign.description}
                </p>
              </div>
            </div>

            {/* Campaign Updates */}
            <div className="bg-white rounded-xl shadow-md p-8 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Updates</h2>
              {updates.length === 0 ? (
                <p className="text-gray-600">No updates yet</p>
              ) : (
                <div className="space-y-6">
                  {updates.map((update, index) => (
                    <div key={index} className="border-l-4 border-blue-600 pl-4">
                      <div className="text-sm text-gray-600 mb-1">{formatDate(update.date)}</div>
                      <h3 className="font-bold text-gray-900 mb-2">{update.title}</h3>
                      <p className="text-gray-700">{update.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Donations */}
            <div className="bg-white rounded-xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>
              {donations.length === 0 ? (
                <p className="text-gray-600">Be the first to donate!</p>
              ) : (
                <div className="space-y-4">
                  {donations.slice(0, 10).map((donation, index) => (
                    <div key={index} className="flex justify-between items-center py-3 border-b">
                      <div>
                        <p className="font-medium text-gray-900">{donation.donor?.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">{formatDate(donation.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600">${donation.amount?.toLocaleString()}</p>
                        {donation.blockchainHash && (
                          <p className="text-xs text-gray-500">On-chain</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Donation Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Support this campaign</h3>

              {success ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <svg className="w-16 h-16 text-green-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h4 className="text-lg font-bold text-green-900 mb-2">Thank you!</h4>
                  <p className="text-green-700">Your donation has been recorded on the blockchain</p>
                </div>
              ) : (
                <>
                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                      {error}
                    </div>
                  )}

                  {!showDonationForm ? (
                    <button
                      onClick={() => setShowDonationForm(true)}
                      className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition text-lg"
                    >
                      Donate Now
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map(amount => (
                          <button
                            key={amount}
                            onClick={() => {
                              setDonationAmount(amount);
                              setCustomAmount('');
                            }}
                            className={`py-3 rounded-lg border-2 transition ${
                              donationAmount === amount
                                ? 'border-blue-600 bg-blue-50 text-blue-600 font-medium'
                                : 'border-gray-300 hover:border-blue-400'
                            }`}
                          >
                            ${amount}
                          </button>
                        ))}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Or enter custom amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-3 text-gray-500">$</span>
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => {
                              setCustomAmount(e.target.value);
                              setDonationAmount('');
                            }}
                            placeholder="0.00"
                            className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleDonation}
                        disabled={processing || (!donationAmount && !customAmount)}
                        className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {processing ? 'Processing...' : 'Complete Donation'}
                      </button>

                      <button
                        onClick={() => {
                          setShowDonationForm(false);
                          setDonationAmount('');
                          setCustomAmount('');
                          setError('');
                        }}
                        className="w-full py-2 text-gray-600 hover:text-gray-900 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  <div className="mt-6 pt-6 border-t">
                    <h4 className="font-medium text-gray-900 mb-3">Why donate through CharityChain?</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Blockchain-verified transactions
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        100% transparent tracking
                      </li>
                      <li className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Verified NGO partners
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}