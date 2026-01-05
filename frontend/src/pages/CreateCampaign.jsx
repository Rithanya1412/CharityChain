import { API_URL } from '../config';
import { useState } from 'react';

export default function CreateCampaign({ user, setCurrentPage }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'education',
    targetAmount: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const categories = [
    { value: 'education', label: 'Education' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'environment', label: 'Environment' },
    { value: 'disaster-relief', label: 'Disaster Relief' },
    { value: 'poverty', label: 'Poverty Alleviation' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateForm = () => {
    if (!formData.title.trim()) {
      setError('Campaign title is required');
      return false;
    }
    if (formData.title.length < 10) {
      setError('Campaign title must be at least 10 characters');
      return false;
    }
    if (!formData.description.trim()) {
      setError('Campaign description is required');
      return false;
    }
    if (formData.description.length < 50) {
      setError('Campaign description must be at least 50 characters');
      return false;
    }
    if (!formData.targetAmount || formData.targetAmount <= 0) {
      setError('Please enter a valid target amount');
      return false;
    }
    if (formData.targetAmount < 100) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/campaigns`, {
        method: 'POST',
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
        setSuccess(true);
        setTimeout(() => {
          setCurrentPage('ngo-dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create campaign');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Campaign Created!</h2>
          <p className="text-gray-600 mb-6">Your campaign has been successfully created and is now live.</p>
          <p className="text-sm text-gray-500">Redirecting to dashboard...</p>
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
            <h1 className="text-2xl font-bold text-blue-600">CharityChain</h1>
            <p className="text-sm text-gray-600">Create New Campaign</p>
          </div>
          <button
            onClick={() => setCurrentPage('ngo-dashboard')}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Create a New Campaign</h2>
            <p className="text-gray-600">
              Fill in the details below to launch your fundraising campaign. All campaigns are subject to admin approval.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <div className="space-y-6">
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
                placeholder="e.g., Build a School for Underprivileged Children"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                maxLength={100}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.title.length}/100 characters (minimum 10)
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
                placeholder="Describe your campaign in detail. Include the problem you're addressing, your solution, how funds will be used, and the expected impact."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={2000}
              ></textarea>
              <p className="text-sm text-gray-500 mt-1">
                {formData.description.length}/2000 characters (minimum 50)
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
                  placeholder="0.00"
                  min="100"
                  step="0.01"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum $100</p>
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
              <p className="text-sm text-gray-500 mt-1">
                Choose a realistic timeline for your fundraising goal
              </p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex gap-3">
                <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Important Information</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• All campaigns are reviewed by admins before going live</li>
                    <li>• You can edit campaign details after creation</li>
                    <li>• Regular updates to donors increase trust and engagement</li>
                    <li>• All donations are recorded on the blockchain for transparency</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setCurrentPage('ngo-dashboard')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Campaign...' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>

        {/* Guidelines */}
        <div className="mt-6 bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Campaign Guidelines</h3>
          <div className="space-y-3 text-sm text-gray-700">
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p>Be clear and specific about your goals and how funds will be used</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p>Set realistic funding targets based on your actual needs</p>
            </div>
            <div className="flex gap-3">
              <span className="text-green-600 font-bold">✓</span>
              <p>Provide regular updates to keep donors informed of progress</p>
            </div>
            <div className="flex gap-3">
              <span className="text-red-600 font-bold">✗</span>
              <p>Do not create duplicate campaigns for the same cause</p>
            </div>
            <div className="flex gap-3">
              <span className="text-red-600 font-bold">✗</span>
              <p>Do not provide false or misleading information</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}