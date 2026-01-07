import { API_URL } from '../config';
import { useState, useEffect } from 'react';

export default function AdminDashboard({ user, setUser, setUserRole }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [ngos, setNgos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalCampaigns: 0,
    totalNGOs: 0,
    pendingVerifications: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [ngosRes, campaignsRes, statsRes] = await Promise.all([
        fetch(`${API_URL}/api/admin/ngos`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_URL}/api/admin/campaigns`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
    
        fetch(`${API_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);

      const ngosData = await ngosRes.json();
      const campaignsData = await campaignsRes.json();
      const statsData = await statsRes.json();

      setNgos(ngosData);
      setCampaigns(campaignsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNGO = async (ngoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5173/api/admin/verify-ngo/${ngoId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error verifying NGO:', error);
    }
  };

  const handleRejectNGO = async (ngoId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5173/api/admin/reject-ngo/${ngoId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error rejecting NGO:', error);
    }
  };

  const handleSuspendCampaign = async (campaignId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5173/api/admin/suspend-campaign/${campaignId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchAdminData();
      }
    } catch (error) {
      console.error('Error suspending campaign:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    setUser(null);
    setUserRole(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">CharityChain Admin</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              ${stats.totalDonations?.toLocaleString() || 0}
            </div>
            <div className="text-gray-600">Total Donations</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {stats.totalCampaigns || 0}
            </div>
            <div className="text-gray-600">Active Campaigns</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {stats.totalNGOs || 0}
            </div>
            <div className="text-gray-600">Verified NGOs</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="text-3xl font-bold text-orange-600 mb-2">
              {stats.pendingVerifications || 0}
            </div>
            <div className="text-gray-600">Pending Reviews</div>
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
              onClick={() => setActiveTab('ngos')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'ngos'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              NGO Verification
            </button>
            <button
              onClick={() => setActiveTab('campaigns')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'campaigns'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Campaign Management
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-900 mb-2">Pending Actions</h3>
                    <p className="text-yellow-700">
                      You have {stats.pendingVerifications || 0} NGO verification requests awaiting review.
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Recent Activity</h3>
                    <p className="text-green-700">
                      The platform is running smoothly with {stats.totalCampaigns || 0} active campaigns.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ngos' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">NGO Verification</h2>
                <div className="space-y-4">
                  {ngos.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No NGOs pending verification</p>
                  ) : (
                    ngos.map(ngo => (
                      <div key={ngo._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{ngo.name}</h3>
                            <p className="text-gray-600">{ngo.email}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            ngo.verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {ngo.verified ? 'Verified' : 'Pending'}
                          </span>
                        </div>
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Registration Number:</span> {ngo.registrationNumber || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium">Contact:</span> {ngo.contactNumber || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Description:</span> {ngo.description || 'No description provided'}
                          </p>
                        </div>
                        {!ngo.verified && (
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleVerifyNGO(ngo._id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                            >
                              Verify
                            </button>
                            <button
                              onClick={() => handleRejectNGO(ngo._id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {activeTab === 'campaigns' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Campaign Management</h2>
                <div className="space-y-4">
                  {campaigns.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">No campaigns to manage</p>
                  ) : (
                    campaigns.map(campaign => (
                      <div key={campaign._id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{campaign.title}</h3>
                            <p className="text-gray-600">by {campaign.ngo?.name || 'Unknown NGO'}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            campaign.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {campaign.status || 'active'}
                          </span>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">
                              ${campaign.currentAmount?.toLocaleString() || 0} / ${campaign.targetAmount?.toLocaleString() || 0}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{
                                width: `${Math.min(
                                  ((campaign.currentAmount || 0) / (campaign.targetAmount || 1)) * 100,
                                  100
                                )}%`
                              }}
                            ></div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                          {campaign.description?.substring(0, 150)}...
                        </p>
                        {campaign.status !== 'suspended' && (
                          <button
                            onClick={() => handleSuspendCampaign(campaign._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            Suspend Campaign
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}