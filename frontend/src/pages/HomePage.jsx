import { useState, useEffect } from 'react';
export default function HomePage({ setCurrentPage }) {
  const [stats, setStats] = useState({
    totalDonated: 0,
    activeCampaigns: 0,
    verifiedNGOs: 0,
    totalDonors: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173';
      const response = await fetch(`${API_URL}/api/campaigns/public-stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header>
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg"></div>
            <h1 className="text-2xl font-bold text-gray-900">CharityChain</h1>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('about')}
              className="px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-medium"
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition font-medium"
            >
              Join Us
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="hero-card">
          {/* Hero Card */}
          <div className="bg-gradient-to-r from-teal-600 to-blue-800 rounded-3xl p-16 text-center text-white mb-12 shadow-2xl">
            <h2 className="text-5xl font-bold mb-6">Welcome to CharityChain</h2>
            <p className="text-2xl mb-12 text-blue-100">
              Transparent blockchain donations connecting donors with verified NGOs
            </p>
            </div>
            <div className="hero-buttons">
  <button
    onClick={() => setCurrentPage('login')}
    className="hero-btn-primary"
  >
    Login
  </button>

  <button
    onClick={() => setCurrentPage('login')}
    className="hero-btn-outline"
  >
    Register
  </button>
</div> </div>
</main>

          {/* Stats Grid */}
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {stats.totalDonated.toFixed(1)} ETH
                </div>
                <div className="text-gray-600 text-lg">Donated</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {stats.activeCampaigns}+
                </div>
                <div className="text-gray-600 text-lg">Campaigns</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {stats.totalDonors}+
                </div>
                <div className="text-gray-600 text-lg">Donors</div>
              </div>

              <div className="bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition">
                <div className="text-4xl font-bold text-teal-600 mb-2">
                  {stats.verifiedNGOs}+
                </div>
                <div className="text-gray-600 text-lg">NGOs</div>
              </div>
            </div>
          )}
        </div>
      
        )
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg">&copy; 2025 CharityChain. Built with blockchain</p>
        </div>
      </footer>

    }