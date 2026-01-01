import { useState, useEffect } from 'react';

export default function EditCampaign({ campaign, setCurrentPage }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education',
    targetAmount: '',
    endDate: ''
  });
  const [updateData, setUpdateData] = useState({
    title: '',
    content: ''
  });
  const [activeTab, setActiveTab] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const categories = [
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'environment', label: 'Environment' },
    { value: 'disaster-relief', label: 'Disaster Relief' },
    { value: 'poverty', label: 'Poverty Alleviation' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (campaign) {
      setFormData({
        title: campaign.title || '',
        description: campaign.description || '',
        category: campaign.category || 'education',
        targetAmount: campaign.targetAmount || '',
        endDate: campaign.endDate ? new Date(campaign.endDate).toISOString().split('T')[0] : ''
      });
    }
  }, [campaign]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    setUpdateData({
      ...updateData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.title.trim() || formData.title.length < 10) {
      setError('Campaign title must be at least 10 characters');
      return false;
    }
    if (!formData.description.trim() || formData.description.length < 50) {
      setError('Campaign description must be at least 50 characters');
      return false;
    }
    if (!formData.targetAmount || formData.targetAmount < 100) {
      setError('Target amount must be at least $100');
      return false;
    }
    if (!formData.endDate) {
      setError('Please select an end date');
      return false;
    }
    const endDate = new Date(formData.endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (endDate <= today) {
      setError('End date must be in the future');
      return false;
    }
    return true;
  };

  const handleSubmitDetails = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaign._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          targetAmount: parseFloat(formData.targetAmount)
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Campaign updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update campaign');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePostUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!updateData.title.trim() || !updateData.content.trim()) {
      setError('Both update title and content are required');
      return;
    }

    if (updateData.content.length < 20) {
      setError('Update content must be at least 20 characters');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/campaigns/${campaign._id}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Update posted successfully!');
        setUpdateData({ title: '', content: '' });
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to post update');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Campaign not found</p>
      </div>
    );
  }

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">CharityChain</h1>
            <p className="text-sm text-gray-600">Edit Campaign</p>
          </div>
          <button
            onClick={() => setCurrentPage('ngo-dashboard')}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Campaign Info Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{campaign.title}</h2>
          <div className="flex gap-4 text-sm text-gray-600">
            <span>Raised: ${campaign.currentAmount?.toLocaleString() || 0}</span>
            <span>•</span>
            <span>Goal: ${campaign.targetAmount?.toLocaleString() || 0}</span>
            <span>•</span>
            <span>{campaign.donorsCount || 0} donors</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('details')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'details'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Campaign Details
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`px-6 py-4 font-medium transition ${
                activeTab === 'updates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Post Update
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
                {success}
              </div>
            )}

            {/* Details Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-sm text-yellow-800">
                        Editing campaign details will require admin approval for major changes.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Campaign Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={100}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.title.length}/100 characters
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={2000}
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    {formData.description.length}/2000 characters
                  </p>
                </div>

                {/* Target Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Amount (USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-500 text-lg">$</span>
                    <input
                      type="number"
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      min="100"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Campaign End Date *
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    min={getMinDate()}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitDetails}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Saving Changes...' : 'Save Changes'}
                </button>
              </div>
            )}

            {/* Updates Tab */}
            {activeTab === 'updates' && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex gap-3">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1">Keep Donors Informed</h4>
                      <p className="text-sm text-blue-800">
                        Regular updates build trust and encourage continued support. Share progress, milestones, and how donations are being used.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Update Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={updateData.title}
                    onChange={handleUpdateChange}
                    placeholder="e.g., Construction Phase 1 Complete!"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    maxLength={100}
                  />
                </div>

                {/* Update Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Update Content *
                  </label>
                  <textarea
                    name="content"
                    value={updateData.content}
                    onChange={handleUpdateChange}
                    rows={10}
                    placeholder="Share detailed progress updates, photos descriptions, testimonials, or any information that helps donors see the impact of their contributions."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    maxLength={1000}
                  ></textarea>
                  <p className="text-sm text-gray-500 mt-1">
                    {updateData.content.length}/1000 characters (minimum 20)
                  </p>
                </div>

                {/* Post Update Button */}
                <button
                  onClick={handlePostUpdate}
                  disabled={loading}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Posting Update...' : 'Post Update'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Tips for Effective Updates</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>Post updates regularly (weekly or bi-weekly recommended)</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>Include specific details about how funds are being used</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>Share stories and testimonials from beneficiaries</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>Be transparent about challenges and how you're addressing them</span>
            </li>
            <li className="flex gap-2">
              <span className="text-green-600">•</span>
              <span>Thank donors and acknowledge their contributions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}