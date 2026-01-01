export default function AboutPage({ setCurrentPage }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">CharityChain</h1>
          <button
            onClick={() => setCurrentPage('login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Login
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Revolutionizing Charity with Blockchain
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Transparent, secure, and traceable donations powered by blockchain technology
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Mission Section */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-6 text-center">Our Mission</h3>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto text-center leading-relaxed">
            CharityChain aims to restore trust in charitable giving by providing complete transparency 
            through blockchain technology. Every donation is recorded on an immutable ledger, ensuring 
            that your contributions reach their intended destination and make a real impact.
          </p>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">Why CharityChain?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">100% Transparent</h4>
              <p className="text-gray-600">
                Every transaction is recorded on the blockchain. Track your donation from start to finish 
                and see exactly how it's being used.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Secure & Immutable</h4>
              <p className="text-gray-600">
                Blockchain technology ensures that donation records cannot be altered or tampered with, 
                providing ultimate security and trust.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">Real-Time Impact</h4>
              <p className="text-gray-600">
                See the immediate impact of your donations with live updates from NGOs and detailed 
                progress reports on campaigns.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-16 bg-white rounded-2xl p-10 shadow-lg">
          <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">How It Works</h3>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                1
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Browse Campaigns</h4>
                <p className="text-gray-600">
                  Explore verified NGO campaigns across various causes including education, healthcare, 
                  environment, and disaster relief.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                2
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Make a Donation</h4>
                <p className="text-gray-600">
                  Choose your preferred campaign and donation amount. Your transaction is securely 
                  recorded on the blockchain instantly.
                </p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl">
                3
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">Track Your Impact</h4>
                <p className="text-gray-600">
                  Receive real-time updates on how your donation is being used. View progress reports, 
                  photos, and blockchain transaction records.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-10 text-white mb-16">
          <h3 className="text-3xl font-bold mb-10 text-center">Our Impact</h3>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">$2.5M+</div>
              <div className="text-blue-100">Total Donations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Active Campaigns</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-blue-100">Verified NGOs</div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-6">Ready to Make a Difference?</h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join CharityChain for transparent, impactful giving.
          </p>
          <button
            onClick={() => setCurrentPage('login')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-medium hover:bg-blue-700 transition shadow-lg"
          >
            Get Started Now
          </button>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p>&copy; 2025 CharityChain.</p>
        </div>
      </footer>
    </div>
  );
}