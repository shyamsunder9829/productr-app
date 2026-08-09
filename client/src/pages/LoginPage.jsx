import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

export default function LoginPage() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);

  const isSignup = mode === 'signup';

  const validateInput = () => {
    if (!identifier.trim()) {
      toast.error('Please enter your email or phone number');
      return false;
    }

    const isEmail = identifier.includes('@');
    if (isEmail) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier)) {
        toast.error('Please enter a valid email address');
        return false;
      }
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(identifier.replace(/[-\s]/g, ''))) {
        toast.error('Please enter a valid 10-digit phone number');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateInput()) return;

    setLoading(true);
    try {
      const endpoint = isSignup ? '/auth/signup' : '/auth/login';
      const res = await API.post(endpoint, { identifier: identifier.trim() });
      
      toast.success(`${res.data.message}. Check your inbox or Spam folder.`);
      navigate('/otp', { state: { identifier: identifier.trim(), isSignup } });
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      const suggestSignup = err.response?.data?.suggestSignup;
      
      toast.error(errorMsg);
      
      if (suggestSignup && !isSignup) {
        setTimeout(() => {
          toast((t) => (
            <div className="flex flex-col gap-2">
              <p>Don't have an account yet?</p>
              <button
                onClick={() => {
                  toast.dismiss(t.id);
                  setMode('signup');
                }}
                className="bg-[#1e3a8a] text-white px-4 py-2 rounded hover:bg-[#162e6b] font-semibold"
              >
                Create Account
              </button>
            </div>
          ), { duration: 5000 });
        }, 500);
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(isSignup ? 'login' : 'signup');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #e8e0f5 0%, #dde8f8 40%, #f5e8e0 100%)'
        }}></div>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-60"
          style={{ background: 'linear-gradient(135deg, #c9b8e8, #a8c4e8)' }}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-50"
          style={{ background: 'linear-gradient(135deg, #e8c9b8, #e8d4c9)' }}></div>
        <div className="absolute top-1/3 right-20 w-20 h-20 rounded-full opacity-40"
          style={{ background: 'linear-gradient(135deg, #b8c9e8, #c9b8e8)' }}></div>
        <div className="absolute bottom-40 left-20 w-16 h-16 rounded-full opacity-50"
          style={{ background: 'linear-gradient(135deg, #e8d4c9, #e8c9b8)' }}></div>

        <div className="absolute top-8 left-8 flex items-center gap-1.5">
          <span className="text-[#1e3a8a] text-xl font-bold">Productr</span>
          <div className="flex">
            <div className="w-4 h-4 rounded-full bg-orange-400"></div>
            <div className="w-4 h-4 rounded-full bg-orange-300 -ml-2 mt-1 opacity-80"></div>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-56 h-80 rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: 'linear-gradient(160deg, #e8a070 0%, #c45a20 50%, #8a3010 100%)' }}>
            <div className="absolute inset-0 flex items-center justify-center">
              <svg viewBox="0 0 100 140" className="w-32 h-44 opacity-90" fill="rgba(0,0,0,0.75)">
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
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-1.5 mb-8 lg:hidden">
            <span className="text-[#1e3a8a] text-xl font-bold">Productr</span>
            <div className="flex">
              <div className="w-4 h-4 rounded-full bg-orange-400"></div>
              <div className="w-4 h-4 rounded-full bg-orange-300 -ml-2 mt-1"></div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {isSignup ? 'Create your Productr Account' : 'Login to your Productr Account'}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            {isSignup
              ? 'Enter your email or 10-digit phone number to create your account. You\'ll receive an OTP to verify.'
              : 'Enter your registered email or 10-digit phone number to login.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email or Phone number</label>
              <input
                type="text"
                className="input-field"
                placeholder={isSignup ? "email@example.com or 9876543210" : "Acme@gmail.com or 9876543210"}
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                autoFocus
              />
              <p className="text-xs text-gray-400 mt-1.5">
                {isSignup ? 'Phone must be 10 digits' : 'Phone must be 10 digits'}
              </p>
            </div>
            <button type="submit" disabled={loading} className="w-full btn-primary py-3 text-base font-semibold">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isSignup ? 'Creating Account...' : 'Signing In...'}
                </span>
              ) : isSignup ? 'Create Account' : 'Login'}
            </button>
          </form>

          <div className="mt-8 p-4 border border-gray-200 rounded-xl text-center">
            <p className="text-gray-400 text-sm">
              {isSignup ? 'Already have a Productr account?' : "Don't have a Productr Account?"}
            </p>
            <button
              type="button"
              onClick={toggleMode}
              className="text-[#1e3a8a] font-semibold text-sm mt-0.5 hover:underline"
            >
              {isSignup ? 'Login Here' : 'Sign Up Here'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

