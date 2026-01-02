import { useState, useEffect } from 'react';

// Import all pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import NGORegistration from './pages/NGORegistration';
import DonorDashboard from './pages/DonorDashboard';
import NGODashboard from './pages/NGODashboard';
import AdminDashboard from './pages/AdminDashboard';
import CampaignsPage from './pages/CampaignsPage';
import CampaignDetails from './pages/CampaignDetails';
import CreateCampaign from './pages/CreateCampaign';
import EditCampaign from './pages/EditCampaign';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  // Authentication state
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  
  // Navigation state
  const [currentPage, setCurrentPage] = useState('home');
  
  // Campaign state
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  
  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    const savedRole = localStorage.getItem('userRole');

    if (token && savedRole) {
      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setUserRole(savedRole);
          setCurrentPage('dashboard');
        } else {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      } catch (error) {
        console.error('Auth verification error:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
      }
    }

    setIsLoading(false);
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Route to appropriate page based on currentPage state
  
  // Public pages (no authentication required)
  if (currentPage === 'home') {
    return <HomePage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'about') {
    return <AboutPage setCurrentPage={setCurrentPage} />;
  }

  if (currentPage === 'login') {
    return (
      <LoginPage 
        setUser={setUser} 
        setUserRole={setUserRole}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === 'ngo-registration') {
    return <NGORegistration setCurrentPage={setCurrentPage} />;
  }

  // Campaigns page (accessible to all, but with different features for logged-in users)
  if (currentPage === 'campaigns') {
    return (
      <CampaignsPage
        user={user}
        setCurrentPage={setCurrentPage}
        setSelectedCampaign={setSelectedCampaign}
      />
    );
  }

  if (currentPage === 'campaign-details') {
    return (
      <CampaignDetails
        campaign={selectedCampaign}
        user={user}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // Protected routes - require authentication
  if (!user) {
    // User is not authenticated, redirect to login
    return (
      <LoginPage 
        setUser={setUser} 
        setUserRole={setUserRole}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // Dashboard routing based on user role
  if (currentPage === 'dashboard') {
    if (userRole === 'admin') {
      return (
        <AdminDashboard
          user={user}
          setUser={setUser}
          setUserRole={setUserRole}
        />
      );
    }
    
    if (userRole === 'ngo') {
      return (
        <NGODashboard
          user={user}
          setUser={setUser}
          setUserRole={setUserRole}
          setCurrentPage={setCurrentPage}
          setEditingCampaign={setEditingCampaign}
        />
      );
    }
    
    if (userRole === 'donor') {
      return (
        <DonorDashboard
          user={user}
          setUser={setUser}
          setUserRole={setUserRole}
          setCurrentPage={setCurrentPage}
          setSelectedCampaign={setSelectedCampaign}
        />
      );
    }
  }

  // Role-specific dashboards
  if (currentPage === 'admin-dashboard' && userRole === 'admin') {
    return (
      <AdminDashboard
        user={user}
        setUser={setUser}
        setUserRole={setUserRole}
      />
    );
  }

  if (currentPage === 'ngo-dashboard' && userRole === 'ngo') {
    return (
      <NGODashboard
        user={user}
        setUser={setUser}
        setUserRole={setUserRole}
        setCurrentPage={setCurrentPage}
        setEditingCampaign={setEditingCampaign}
      />
    );
  }

  if (currentPage === 'donor-dashboard' && userRole === 'donor') {
    return (
      <DonorDashboard
        user={user}
        setUser={setUser}
        setUserRole={setUserRole}
        setCurrentPage={setCurrentPage}
        setSelectedCampaign={setSelectedCampaign}
      />
    );
  }

  // Campaign management (NGO only)
  if (currentPage === 'create-campaign' && userRole === 'ngo') {
    return (
      <CreateCampaign
        user={user}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  if (currentPage === 'edit-campaign' && userRole === 'ngo') {
    return (
      <EditCampaign
        campaign={editingCampaign}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // Profile page (all authenticated users)
  if (currentPage === 'profile') {
    return (
      <ProfilePage
        user={user}
        setUser={setUser}
        userRole={userRole}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // 404 Not Found - catch all for invalid routes
  return (
    <NotFoundPage
      setCurrentPage={setCurrentPage}
      user={user}
      userRole={userRole}
    />
  );
}

export default App;