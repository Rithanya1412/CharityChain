import { API_URL } from '../config';
import { useState, useEffect } from 'react';

export default function DonorDashboard({ user, setUser, setUserRole, setCurrentPage, setSelectedCampaign }) {
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState({
    totalDonated: 0,
    campaignsSupported: 0,
    impactScore: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDonorData();
  }, []);

  const fetchDonorData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [donationsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/donations/my-donations', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/donations/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const donationsData = await donationsRes.json();
      const statsData = await statsRes.json();

      setDonations(donationsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching donor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    setUserRole(null);
  };

  const handleViewCampaign = (campaign) => {
    setSelectedCampaign(campaign);
    setCurrentPage('campaign-details');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">CharityChain</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('campaigns')}
                className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
              >
                Browse Campaigns
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-2">Your Impact Dashboard</h2>
          <p className="text-blue-100">Track your donations and see the difference you're making</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 -mt-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${stats.totalDonated?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Total Donated</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.campaignsSupported || 0}
                </div>
                <div className="text-sm text-gray-600">Campaigns Supported</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.impactScore || 0}
                </div>
                <div className="text-sm text-gray-600">Impact Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('donations')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'donations'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Donations
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Your Giving Journey</h3>
                  {donations.length === 0 ? (
                    <div className="text-center py-12">
                      <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Start Your Impact</h4>
                      <p className="text-gray-600 mb-6">You haven't made any donations yet. Browse campaigns to get started!</p>
                      <button
                        onClick={() => setCurrentPage('campaigns')}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                      >
                        Browse Campaigns
                      </button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                        <h4 className="font-medium text-gray-900 mb-2">Recent Activity</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Your last donation was {formatDate(donations[0]?.createdAt)}
                        </p>
                        <div className="text-2xl font-bold text-blue-600">
                          ${donations[0]?.amount?.toLocaleString() || 0}
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          to {donations[0]?.campaign?.title}
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                        <h4 className="font-medium text-gray-900 mb-2">Blockchain Verified</h4>
                        <p className="text-sm text-gray-600 mb-4">
                          All your donations are recorded on-chain
                        </p>
                        <div className="text-2xl font-bold text-green-600">
                          {donations.length}
                        </div>
                        <p className="text-sm text-gray-700 mt-2">
                          verified transactions
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {donations.length > 0 && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="font-medium text-blue-900 mb-2">Keep Making a Difference</h4>
                    <p className="text-sm text-blue-800 mb-4">
                      Your contributions are changing lives. Explore more campaigns and continue your impact journey.
                    </p>
                    <button
                      onClick={() => setCurrentPage('campaigns')}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                    >
                      Discover More Campaigns
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'donations' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Donation History</h3>
                  <span className="text-sm text-gray-600">{donations.length} total donations</span>
                </div>

                {donations.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No donations yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {donations.map((donation) => (
                      <div
                        key={donation._id}
                        className="bg-gray-50 rounded-lg p-6 border border-gray-200 hover:shadow-md transition"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">
                              {donation.campaign?.title || 'Unknown Campaign'}
                            </h4>
                            <p className="text-sm text-gray-600">
                              by {donation.campaign?.ngo?.name || 'Unknown NGO'}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-blue-600">
                              ${donation.amount?.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {formatDate(donation.createdAt)}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 text-sm">
                            {donation.blockchainHash ? (
                              <>
                                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="text-green-700 font-medium">Verified on blockchain</span>
                              </>
                            ) : (
                              <>
                                <svg className="w-4 h-4 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                                <span className="text-yellow-700">Processing...</span>
                              </>
                            )}
                          </div>
                          <button
                            onClick={() => handleViewCampaign(donation.campaign)}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            View Campaign →
                          </button>
                        </div>

                        {donation.blockchainHash && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Transaction Hash:</p>
                            <p className="text-xs font-mono text-gray-700 break-all">
                              {donation.blockchainHash}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}