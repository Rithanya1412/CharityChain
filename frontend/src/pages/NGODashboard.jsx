import { API_URL } from '../config';
import { useState, useEffect } from 'react';

export default function NGODashboard({ user, setUser, setUserRole, setCurrentPage, setEditingCampaign }) {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalRaised: 0,
    activeCampaigns: 0,
    totalDonors: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchNGOData();
  }, []);

  const fetchNGOData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [campaignsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/campaigns/my-campaigns', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/ngo/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      const campaignsData = await campaignsRes.json();
      const statsData = await statsRes.json();

      setCampaigns(campaignsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching NGO data:', error);
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

  const handleEditCampaign = (campaign) => {
    setEditingCampaign(campaign);
    setCurrentPage('edit-campaign');
  };

  const calculateProgress = (current, target) => {
    return Math.min((current / target) * 100, 100);
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
              <p className="text-sm text-gray-600">{user?.name}</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setCurrentPage('create-campaign')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                + New Campaign
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

      {/* Verification Status */}
      {!user?.verified && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-yellow-900">Account Pending Verification</p>
                <p className="text-sm text-yellow-700">Your NGO is under admin review. You'll be notified once verified.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ${stats.totalRaised?.toLocaleString() || 0}
                </div>
                <div className="text-sm text-gray-600">Total Raised</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeCampaigns || 0}
                </div>
                <div className="text-sm text-gray-600">Active Campaigns</div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalDonors || 0}
                </div>
                <div className="text-sm text-gray-600">Total Donors</div>
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
              onClick={() => setActiveTab('campaigns')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'campaigns'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              My Campaigns
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <button
                      onClick={() => setCurrentPage('create-campaign')}
                      className="p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Create New Campaign</div>
                          <div className="text-sm text-gray-600">Launch a new fundraising campaign</div>
                        </div>
                      </div>
                    </button>

                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">Verification Status</div>
                          <div className="text-sm text-gray-600">
                            {user?.verified ? 'Verified NGO' : 'Pending Verification'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {campaigns.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Campaign Performance</h3>
                    <div className="space-y-4">
                      {campaigns.slice(0, 3).map((campaign) => (
                        <div key={campaign._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium text-gray-900">{campaign.title}</h4>
                            <span className="text-sm text-gray-600">
                              {Math.round(calculateProgress(campaign.currentAmount || 0, campaign.targetAmount || 1))}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${calculateProgress(campaign.currentAmount || 0, campaign.targetAmount || 1)}%`
                              }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>${campaign.currentAmount?.toLocaleString() || 0} raised</span>
                            <span>{campaign.donorsCount || 0} donors</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-2">Tips for Success</h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Post regular updates to keep donors engaged</li>
                    <li>• Use clear, compelling campaign descriptions</li>
                    <li>• Respond promptly to donor questions</li>
                    <li>• Share impact stories and progress photos</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">All Campaigns</h3>
                  <button
                    onClick={() => setCurrentPage('create-campaign')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                  >
                    + Create New
                  </button>
                </div>

                {campaigns.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No Campaigns Yet</h4>
                    <p className="text-gray-600 mb-6">Create your first campaign to start fundraising</p>
                    <button
                      onClick={() => setCurrentPage('create-campaign')}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Create Your First Campaign
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {campaigns.map((campaign) => (
                      <div key={campaign._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{campaign.title}</h4>
                            <p className="text-sm text-gray-600">{campaign.category?.replace('-', ' ')}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {campaign.status || 'active'}
                          </span>
                        </div>

                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="font-medium text-gray-700">
                              ${campaign.currentAmount?.toLocaleString() || 0}
                            </span>
                            <span className="text-gray-600">
                              of ${campaign.targetAmount?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-blue-600 h-3 rounded-full"
                              style={{
                                width: `${calculateProgress(campaign.currentAmount || 0, campaign.targetAmount || 1)}%`
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <span>{campaign.donorsCount || 0} donors</span>
                            <span className="mx-2">•</span>
                            <span>Ends {formatDate(campaign.endDate)}</span>
                          </div>
                          <button
                            onClick={() => handleEditCampaign(campaign)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm"
                          >
                            Edit Campaign
                          </button>
                        </div>
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