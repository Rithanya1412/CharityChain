import { useState, useEffect } from 'react';

export default function ProfilePage({ user, setUser, userRole, setCurrentPage }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contactNumber: '',
    website: '',
    address: '',
    description: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        contactNumber: user.contactNumber || '',
        website: user.website || '',
        address: user.address || '',
        description: user.description || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };

  const handleUpdateProfile = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    setError('');
    setSuccess('');

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      setError('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password updated successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to update password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getDashboardPage = () => {
    switch(userRole) {
      case 'admin': return 'admin-dashboard';
      case 'ngo': return 'ngo-dashboard';
      case 'donor': return 'donor-dashboard';
      default: return 'dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">CharityChain</h1>
            <p className="text-sm text-gray-600">Profile Settings</p>
          </div>
          <button
            onClick={() => setCurrentPage(getDashboardPage())}
            className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-gray-600 mb-2">{user?.email}</p>
              <div className="flex gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userRole === 'admin' 
                    ? 'bg-purple-100 text-purple-800'
                    : userRole === 'ngo'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {userRole?.toUpperCase()}
                </span>
                {userRole === 'ngo' && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user?.verified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {user?.verified ? 'Verified' : 'Pending Verification'}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Profile Information */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ) : (
                <p className="text-gray-900">{user?.name || 'Not provided'}</p>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <p className="text-gray-900">{user?.email}</p>
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>

            {/* Contact Number */}
            {(userRole === 'ngo' || userRole === 'admin') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{user?.contactNumber || 'Not provided'}</p>
                )}
              </div>
            )}

            {/* Website (NGO only) */}
            {userRole === 'ngo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://www.example.org"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{user?.website || 'Not provided'}</p>
                )}
              </div>
            )}

            {/* Address (NGO only) */}
            {userRole === 'ngo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">{user?.address || 'Not provided'}</p>
                )}
              </div>
            )}

            {/* Description (NGO only) */}
            {userRole === 'ngo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Description
                </label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  ></textarea>
                ) : (
                  <p className="text-gray-900">{user?.description || 'Not provided'}</p>
                )}
              </div>
            )}

            {/* Registration Number (NGO only, read-only) */}
            {userRole === 'ngo' && user?.registrationNumber && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <p className="text-gray-900">{user.registrationNumber}</p>
                <p className="text-xs text-gray-500 mt-1">Cannot be modified</p>
              </div>
            )}
          </div>

          {/* Edit Actions */}
          {isEditing && (
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    contactNumber: user.contactNumber || '',
                    website: user.website || '',
                    address: user.address || '',
                    description: user.description || ''
                  });
                  setError('');
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="bg-white rounded-xl shadow-md p-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Security</h3>
              <p className="text-sm text-gray-600">Update your password</p>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    setError('');
                  }}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePassword}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}