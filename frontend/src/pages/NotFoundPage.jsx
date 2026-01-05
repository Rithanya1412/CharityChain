import { API_URL } from '../config';
export default function NotFoundPage({ setCurrentPage, user, userRole }) {
  const getDashboardPage = () => {
    if (!user) return 'home';
    
    switch(userRole) {
      case 'admin': return 'admin-dashboard';
      case 'ngo': return 'ngo-dashboard';
      case 'donor': return 'donor-dashboard';
      default: return 'home';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-blue-600 mb-4">404</div>
          <div className="flex justify-center mb-6">
            <svg className="w-32 h-32 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! Page Not Found
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setCurrentPage(getDashboardPage())}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-md"
          >
            {user ? 'Go to Dashboard' : 'Go to Home'}
          </button>
          
          {user && (
            <button
              onClick={() => setCurrentPage('campaigns')}
              className="px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium border-2 border-blue-600"
            >
              Browse Campaigns
            </button>
          )}
        </div>

        {/* Additional Links */}
        <div className="mt-12 pt-8 border-t border-gray-300">
          <p className="text-sm text-gray-600 mb-4">Need help?</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <button
              onClick={() => setCurrentPage('about')}
              className="text-blue-600 hover:underline"
            >
              About Us
            </button>
            <span className="text-gray-400">•</span>
            <button
              onClick={() => setCurrentPage('campaigns')}
              className="text-blue-600 hover:underline"
            >
              View Campaigns
            </button>
            {!user && (
              <>
                <span className="text-gray-400">•</span>
                <button
                  onClick={() => setCurrentPage('login')}
                  className="text-blue-600 hover:underline"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}