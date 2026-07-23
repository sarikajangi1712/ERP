import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Boxes, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  CheckCircle2,
  Smartphone,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from '../components/common/Button';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'phone'
  
  // Login State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [isRegLoading, setIsRegLoading] = useState(false);

  // Verification & OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpTargetType, setOtpTargetType] = useState('register'); // 'register' | 'phone_login'
  const [verifiedSuccessMsg, setVerifiedSuccessMsg] = useState('');

  // Phone OTP Login State
  const [phoneLoginNumber, setPhoneLoginNumber] = useState('');

  const { login, register, loginWithPhoneOtp, loginWithGoogle } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  // 1. Submit Login Form
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password', 'error');
      return;
    }
    setIsLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(
        err.response?.data?.message || 'Login failed. Please verify credentials.',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Submit Register Form -> Trigger Verification Step
  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!regName || !regEmail || !regPassword) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    setOtpTargetType('register');
    setShowOtpModal(true);
    showToast('Verification OTP code sent to your phone/email! (Enter 123456)', 'info');
  };

  // 3. Confirm OTP Code Verification
  const handleVerifyOtp = async () => {
    if (otpCode !== '123456') {
      showToast('Invalid verification code! Enter 123456 to verify.', 'error');
      return;
    }

    if (otpTargetType === 'register') {
      setIsRegLoading(true);
      try {
        await register(regName, regEmail, regPassword, regPhone);
        setShowOtpModal(false);
        setVerifiedSuccessMsg(`Account for ${regEmail} verified successfully! Please Sign In below.`);
        setEmail(regEmail);
        setPassword(regPassword);
        setActiveTab('login');
        showToast('Account created and verified! Please Sign In.', 'success');
      } catch (err) {
        showToast(err.response?.data?.message || 'Account registration failed', 'error');
      } finally {
        setIsRegLoading(false);
      }
    } else if (otpTargetType === 'phone_login') {
      setIsLoading(true);
      try {
        const user = await loginWithPhoneOtp(phoneLoginNumber, otpCode);
        setShowOtpModal(false);
        showToast(`Welcome to ERP Portal, ${user.name}!`, 'success');
        navigate('/dashboard');
      } catch (err) {
        showToast(err.response?.data?.message || 'Phone OTP login failed', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 4. Request Phone Login OTP
  const handleSendPhoneOtp = (e) => {
    e.preventDefault();
    if (!phoneLoginNumber) {
      showToast('Please enter your mobile phone number', 'error');
      return;
    }
    setOtpTargetType('phone_login');
    setShowOtpModal(true);
    showToast(`Verification code sent to ${phoneLoginNumber}! (Enter 123456)`, 'info');
  };

  // 5. Firebase Google Sign In
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      const user = await loginWithGoogle();
      showToast(`Logged in via Google: ${user.name}`, 'success');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'auth/configuration-not-found' || err.message?.includes('configuration-not-found')) {
        showToast('Google Sign-In is not enabled in Firebase Console yet. Enable Google in Authentication settings.', 'info');
      } else if (err.code === 'auth/api-key-not-valid' || err.message?.includes('api-key-not-valid')) {
        showToast('Firebase project key required in client/.env', 'info');
      } else {
        showToast(err.message || 'Google Sign-In failed', 'error');
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3.5 rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/30 mb-3">
            <Boxes className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">ERP + CRM Portal</h2>
          <p className="text-xs text-slate-400 mt-1">Wholesale & Distribution Operations Engine</p>
        </div>

        {/* Verification Success Alert Banner */}
        {verifiedSuccessMsg && (
          <div className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{verifiedSuccessMsg}</span>
          </div>
        )}

        {/* Top Tab Bar: Sign In vs Create Account */}
        <div className="flex bg-slate-950 p-1 rounded-2xl border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('phone')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'phone'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Phone OTP
          </button>
        </div>

        {/* TAB 1: SIGN IN FORM */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} autoComplete="off" className="space-y-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  autoComplete="off"
                  required
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="new-password"
                  required
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isLoading} className="w-full mt-4 py-3 text-sm font-semibold" icon={ArrowRight}>
              Sign In to Portal
            </Button>

            <div className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                isLoading={isGoogleLoading}
                className="w-full text-xs text-slate-300 border-slate-800 hover:bg-slate-800"
              >
                🔥 Sign In with Google
              </Button>
            </div>
          </form>
        )}

        {/* TAB 2: CREATE ACCOUNT FORM */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} autoComplete="off" className="space-y-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="john@example.com"
                  required
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Mobile Phone (For OTP Verification)
              </label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  placeholder="+91 9876543210"
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Choose Password
              </label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" isLoading={isRegLoading} className="w-full mt-4 py-3 text-sm font-semibold" icon={ArrowRight}>
              Verify & Create Account
            </Button>
          </form>
        )}

        {/* TAB 3: PHONE NUMBER OTP LOGIN */}
        {activeTab === 'phone' && (
          <form onSubmit={handleSendPhoneOtp} className="space-y-4">
            <div className="flex flex-col gap-1.5 w-full">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Mobile Phone Number
              </label>
              <div className="relative flex items-center">
                <Smartphone className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                <input
                  type="tel"
                  value={phoneLoginNumber}
                  onChange={(e) => setPhoneLoginNumber(e.target.value)}
                  placeholder="+91 9876543210"
                  required
                  className="w-full bg-[#0B0F19] border border-slate-800 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              📱 Enter your mobile number. A 6-digit OTP code will be sent to verify your identity. (Demo OTP Code: <strong className="text-amber-400 font-mono">123456</strong>)
            </p>

            <Button type="submit" className="w-full mt-4 py-3 text-sm font-semibold" icon={ArrowRight}>
              Send Verification OTP Code
            </Button>
          </form>
        )}

        <div className="mt-6 text-center pt-4 border-t border-slate-800/80">
          <p className="text-[11px] text-slate-500">
            Enterprise Security • Encrypted Identity & Verification
          </p>
        </div>
      </div>

      {/* OTP VERIFICATION MODAL */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl">
            <div className="flex flex-col items-center text-center mb-5">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">Enter Verification Code</h3>
              <p className="text-xs text-slate-400 mt-1">
                Enter the 6-digit OTP code sent to your phone/email to verify.
              </p>
              <span className="mt-2 text-xs font-mono bg-slate-950 text-amber-300 px-2.5 py-1 rounded-lg border border-slate-800">
                Demo OTP Code: 123456
              </span>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="123456"
                autoFocus
                className="w-full bg-[#0B0F19] border border-slate-700 rounded-xl px-4 py-3 text-center text-2xl font-mono text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowOtpModal(false)}>
                  Cancel
                </Button>
                <Button className="flex-1" onClick={handleVerifyOtp}>
                  Verify & Proceed
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
