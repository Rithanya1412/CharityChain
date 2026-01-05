import { API_URL } from '../config';
export default function HomePage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CharityChain</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setCurrentPage('about')}
              className="px-4 py-2 text-gray-700 hover:text-blue-600 transition"
            >
              About
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transparent Charity Through Blockchain
            </h2>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Every donation tracked. Every impact verified. Trust restored through technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentPage('login')}
                className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition text-lg shadow-lg"
              >
                Start Donating
              </button>
              <button
                onClick={() => setCurrentPage('about')}
                className="px-8 py-4 bg-blue-500 bg-opacity-30 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-opacity-40 transition text-lg border-2 border-white border-opacity-20"
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">$2.5M+</div>
              <div className="text-gray-600">Donated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600">Active Campaigns</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Verified NGOs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Donors</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose CharityChain?
            </h3>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Revolutionary blockchain technology meets traditional charitable giving
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">100% Transparent</h4>
              <p className="text-gray-600 leading-relaxed">
                Every donation is recorded on the blockchain. Track your contribution from wallet to impact with complete visibility.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Secure & Verified</h4>
              <p className="text-gray-600 leading-relaxed">
                All NGOs are thoroughly vetted. Blockchain technology ensures your donations cannot be altered or misused.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-2xl font-bold text-gray-900 mb-3">Real-Time Impact</h4>
              <p className="text-gray-600 leading-relaxed">
                See immediate updates from NGOs. Watch your donation make a difference with progress reports and blockchain verification.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-xl text-gray-600">Simple, transparent, and impactful</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6">
                1
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Choose a Cause</h4>
              <p className="text-gray-600">
                Browse verified campaigns across education, healthcare, environment, and more. Find a cause that resonates with you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6">
                2
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Make Your Donation</h4>
              <p className="text-gray-600">
                Contribute any amount securely. Your transaction is instantly recorded on the blockchain for complete transparency.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl mb-6">
                3
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Track Your Impact</h4>
              <p className="text-gray-600">
                Receive real-time updates on how your donation is being used. View blockchain records and progress reports anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Make a Difference?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of donors who trust CharityChain for transparent, impactful giving
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setCurrentPage('login')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition text-lg shadow-lg"
            >
              Start Donating Today
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="px-8 py-4 bg-blue-500 bg-opacity-30 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-opacity-40 transition text-lg border-2 border-white border-opacity-20"
            >
              Register as NGO
            </button>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-gray-900 mb-4">What People Say</h3>
            <p className="text-xl text-gray-600">Real stories from our community</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finally, a platform where I can see exactly where my donations go. The blockchain transparency gives me complete peace of mind."
              </p>
              <div className="font-medium text-gray-900">Sarah Johnson</div>
              <div className="text-sm text-gray-600">Regular Donor</div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "CharityChain has revolutionized how we fundraise. Donors trust us more because they can verify everything on the blockchain."
              </p>
              <div className="font-medium text-gray-900">Michael Chen</div>
              <div className="text-sm text-gray-600">NGO Director</div>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "The real-time updates and progress tracking make giving so much more meaningful. I feel connected to the causes I support."
              </p>
              <div className="font-medium text-gray-900">Emily Rodriguez</div>
              <div className="text-sm text-gray-600">First-time Donor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-white font-bold text-lg mb-4">CharityChain</h4>
              <p className="text-sm">
                Transparent charity through blockchain technology. Building trust, one donation at a time.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => setCurrentPage('about')} className="hover:text-white transition">About Us</button></li>
                <li><button onClick={() => setCurrentPage('login')} className="hover:text-white transition">Browse Campaigns</button></li>
                <li><button onClick={() => setCurrentPage('login')} className="hover:text-white transition">Become a Donor</button></li>
                <li><button onClick={() => setCurrentPage('login')} className="hover:text-white transition">Register NGO</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition">Blockchain Guide</a></li>
                <li><a href="#" className="hover:text-white transition">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 CharityChain. All rights reserved. Powered by blockchain technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}