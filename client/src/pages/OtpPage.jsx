import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function OtpPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const identifier = location.state?.identifier || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!identifier) navigate('/login');
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError('');
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasteData.length === 6) setOtp(pasteData.split(''));
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    if (otpString.length !== 6) { setError('Please enter a valid OTP'); return; }
    setLoading(true);
    try {
      const res = await API.post('/auth/verify-otp', { identifier, otp: otpString });
      login(res.data.token, res.data.user);
      toast.success('Login successful!');
      navigate('/products');
    } catch (err) {
      setError(err.response?.data?.message || 'Please enter a valid OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      const res = await API.post('/auth/resend-otp', { identifier });
      toast.success(`${res.data.message || 'OTP resent successfully'}. Check your inbox or Spam folder.`);
      setOtp(['', '', '', '', '', '']);
      setError('');
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(135deg, #e8e0f5 0%, #dde8f8 40%, #f5e8e0 100%)'
        }}></div>
        <div className="absolute top-10 left-10 w-32 h-32 rounded-full opacity-60"
          style={{ background: 'linear-gradient(135deg, #c9b8e8, #a8c4e8)' }}></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full opacity-50"
          style={{ background: 'linear-gradient(135deg, #e8c9b8, #e8d4c9)' }}></div>

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

      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Login to your Productr Account
          </h1>
          <div className="space-y-5">
            <div>
              <label className="label">Enter OTP</label>
              <div className="flex gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-lg outline-none transition-all duration-200
                      ${error
                        ? 'border-red-400 focus:border-red-400 focus:ring-1 focus:ring-red-400'
                        : 'border-gray-300 focus:border-[#1e3a8a] focus:ring-1 focus:ring-[#1e3a8a]'}`}
                  />
                ))}
              </div>
              {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
            </div>

            <button onClick={handleVerify} disabled={loading} className="w-full btn-primary py-3 text-base font-semibold">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Verifying...
                </span>
              ) : 'Enter your OTP'}
            </button>

            <p className="text-center text-sm text-gray-400">
              Didnt recieve OTP ?{' '}
              <button onClick={handleResend} disabled={resendLoading}
                className="text-[#1e3a8a] font-semibold hover:underline disabled:opacity-60">
                {resendLoading ? 'Sending...' : 'Resend'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}