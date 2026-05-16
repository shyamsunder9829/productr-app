import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Zap, Globe, Users } from 'lucide-react';

/**
 * HomePage component - Landing page with product features and benefits
 * @component
 * @returns {React.ReactElement} Home page UI
 */
export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-[#1e3a8a] text-2xl font-bold">Productr</span>
            <div className="flex">
              <div className="w-4 h-4 rounded-full bg-orange-400"></div>
              <div className="w-4 h-4 rounded-full bg-orange-300 -ml-2 mt-1 opacity-80"></div>
            </div>
          </div>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1e3a8a] text-white px-6 py-2 rounded-lg hover:bg-[#162e6b] transition"
          >
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold text-slate-900 mb-6">
            Bring Your Products to Market
          </h1>
          <p className="text-xl text-slate-600 mb-8">
            Productr is the easiest way to list, manage, and sell your products online. Connect with customers and grow your business.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1e3a8a] text-white px-8 py-3 rounded-lg hover:bg-[#162e6b] transition font-semibold text-lg"
          >
            Get Started
          </button>
        </div>
        <div className="flex justify-center">
          <div className="relative w-80 h-96 rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(160deg, #e8a070 0%, #c45a20 50%, #8a3010 100%)' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 140" className="w-40 h-56 opacity-90" fill="rgba(0,0,0,0.75)">
                <circle cx="60" cy="18" r="10"/>
                <path d="M50 30 L35 55 L20 80 M50 30 L65 55 L80 70 M35 55 L30 85 L45 110 M65 55 L70 80 L55 105"
                  stroke="rgba(0,0,0,0.75)" strokeWidth="5" fill="none" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white font-semibold text-sm leading-tight px-4">
                Uplist your<br />product to market
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-16">Why Choose Productr?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <ShoppingCart className="w-8 h-8 text-[#1e3a8a]" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Easy Listing</h3>
              <p className="text-slate-600">List your products in minutes with our simple and intuitive interface.</p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-orange-100 p-4 rounded-full">
                  <Zap className="w-8 h-8 text-orange-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Fast Growth</h3>
              <p className="text-slate-600">Reach more customers and grow your sales faster with our platform.</p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Globe className="w-8 h-8 text-green-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Global Reach</h3>
              <p className="text-slate-600">Connect with customers from around the world and expand globally.</p>
            </div>

            {/* Feature 4 */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="bg-purple-100 p-4 rounded-full">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Community</h3>
              <p className="text-slate-600">Join thousands of sellers and be part of our growing community.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-6">Ready to Start Selling?</h2>
        <p className="text-xl text-slate-600 mb-8">Join thousands of sellers already using Productr.</p>
        <button
          onClick={() => navigate('/login')}
          className="bg-[#1e3a8a] text-white px-8 py-3 rounded-lg hover:bg-[#162e6b] transition font-semibold text-lg"
        >
          Get Started Now
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-8 text-center">
        <p>&copy; 2026 Productr. All rights reserved.</p>
      </footer>
    </div>
  );
}
