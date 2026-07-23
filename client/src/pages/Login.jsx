import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  ShieldCheck,
  Zap,
  Shield,
  TrendingUp,
  Package,
  FileText,
  Users,
  Building2,
  Sparkles,
  KeyRound,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from '../components/common/Button';

// Demo quick-login accounts preset configuration
const DEMO_ROLES = [
  {
    role: 'ADMIN',
    title: 'Admin',
    email: 'admin@erp.com',
    password: 'Password123!',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    borderColor: 'hover:border-blue-500/50',
    bgGlow: 'bg-blue-500/10 text-blue-400',
    desc: 'Full Access & Master Controls'
  },
  {
    role: 'SALES',
    title: 'Sales Exec',
    email: 'sales@erp.com',
    password: 'Password123!',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    borderColor: 'hover:border-emerald-500/50',
    bgGlow: 'bg-emerald-500/10 text-emerald-400',
    desc: 'CRM, Challans & Outreach'
  },
  {
    role: 'WAREHOUSE',
    title: 'Warehouse Mgr',
    email: 'warehouse@erp.com',
    password: 'Password123!',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    borderColor: 'hover:border-amber-500/50',
    bgGlow: 'bg-amber-500/10 text-amber-400',
    desc: 'Inventory & Stock Transfer'
  },
  {
    role: 'ACCOUNTS',
    title: 'Accounts Lead',
    email: 'accounts@erp.com',
    password: 'Password123!',
    icon: FileText,
    color: 'from-purple-500 to-pink-600',
    borderColor: 'hover:border-purple-500/50',
    bgGlow: 'bg-purple-500/10 text-purple-400',
    desc: 'Tax Invoices & GST Reports'
  }
];

export const Login = () => {
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'phone'
  
  // Login State
  const [email, setEmail] = useState('admin@erp.com');
  const [password, setPassword] = useState('Password123!');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [selectedRoleKey, setSelectedRoleKey] = useState('ADMIN');

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

  // Auto fill credentials from Quick Demo Roles
  const handleSelectQuickRole = (demoRole) => {
    setEmail(demoRole.email);
    setPassword(demoRole.password);
    setSelectedRoleKey(demoRole.role);
    setActiveTab('login');
    showToast(`Loaded ${demoRole.title} demo credentials!`, 'info');
  };

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
        err.response?.data?.message || 'Login failed. Please verify database credentials.',
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
    showToast('Verification OTP code sent! (Enter 123456)', 'info');
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
    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
      {/* LEFT COLUMN: Hero Brand, Live Feature Showcase & Quick Demo Role Selector */}
      <motion.div 
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-6 flex flex-col justify-center space-y-6"
      >
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide w-fit">
          <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
          <span>ENTERPRISE OPERATIONS & CRM SUITE</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
        </div>

        {/* Hero Title & Description */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
              <Boxes className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                ERP + CRM Portal
              </h1>
              <p className="text-sm font-medium text-slate-400">
                Wholesale & Multi-Depot Operations Engine
              </p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
            Streamline customer relationships, atomic warehouse stock control, sales challans, tax invoices, and financial reporting with multi-role enterprise security.
          </p>
        </div>

        {/* ⚡ 1-Click Quick Demo Login Selector */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>1-Click Quick Demo Login</span>
            </label>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              Auto-fills Credentials
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {DEMO_ROLES.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedRoleKey === item.role;
              return (
                <button
                  key={item.role}
                  type="button"
                  onClick={() => handleSelectQuickRole(item)}
                  className={`relative p-3 rounded-2xl border text-left transition-all duration-200 group flex items-start gap-3 ${
                    isSelected 
                      ? 'bg-slate-900 border-blue-500/70 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500/50' 
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/80 ' + item.borderColor
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${item.bgGlow}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-white truncate">
                        {item.title}
                      </h4>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{item.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Feature Pill Badges */}
        <div className="flex flex-wrap gap-2 pt-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
            <Shield className="w-3.5 h-3.5 text-blue-400" /> Multi-Role Access Control
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
            <Package className="w-3.5 h-3.5 text-emerald-400" /> Multi-Warehouse Stock Guard
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-medium text-slate-300">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Tax Invoices & Reports
          </span>
        </div>

        {/* Live System Metrics Footer Row */}
        <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/60 text-slate-400 text-xs">
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Uptime</div>
            <div className="font-mono text-slate-200 font-bold text-sm">99.98% SLA</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Security</div>
            <div className="font-mono text-slate-200 font-bold text-sm">256-Bit JWT</div>
          </div>
          <div>
            <div className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">Engine</div>
            <div className="font-mono text-slate-200 font-bold text-sm">PostgreSQL 16</div>
          </div>
        </div>
      </motion.div>

      {/* RIGHT COLUMN: Interactive Card & Auth Form Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="lg:col-span-6 max-w-md mx-auto w-full"
      >
        <div className="bg-[#0E131F]/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative overflow-hidden ring-1 ring-white/5">
          {/* Ambient Glow Arc */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-blue-500/10 via-indigo-500/5 to-transparent rounded-bl-full pointer-events-none" />

          {/* Verification Success Alert Banner */}
          {verifiedSuccessMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5"
            >
              <CheckCircle2 className="w-4.5 h-4.5 shrink-0" />
              <span>{verifiedSuccessMsg}</span>
            </motion.div>
          )}

          {/* Top Tab Bar: Sign In | Create Account | Phone OTP */}
          <div className="flex bg-[#07090E] p-1 rounded-2xl border border-slate-800/80 mb-6 relative">
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 ${
                activeTab === 'login'
                  ? 'text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'login' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-500/30"
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 ${
                activeTab === 'register'
                  ? 'text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'register' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-500/30"
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              Create Account
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('phone')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all relative z-10 ${
                activeTab === 'phone'
                  ? 'text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {activeTab === 'phone' && (
                <motion.div
                  layoutId="activeAuthTab"
                  className="absolute inset-0 bg-blue-600 rounded-xl -z-10 shadow-lg shadow-blue-500/30"
                  transition={{ type: 'spring', duration: 0.4 }}
                />
              )}
              Phone OTP
            </button>
          </div>

          {/* Quick Active Selected Role Helper Banner */}
          {activeTab === 'login' && selectedRoleKey && (
            <div className="mb-4 px-3.5 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Selected Demo Role: <strong>{selectedRoleKey}</strong></span>
              </span>
              <span className="font-mono text-[10px] text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800/60">
                {email}
              </span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* TAB 1: SIGN IN FORM */}
            {activeTab === 'login' && (
              <motion.form 
                key="login-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleLoginSubmit} 
                autoComplete="off" 
                className="space-y-4"
              >
                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Email Address</span>
                    <span className="text-[10px] text-slate-500 font-mono">PostgreSQL User</span>
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setSelectedRoleKey('');
                      }}
                      placeholder="admin@erp.com"
                      autoComplete="off"
                      required
                      className="w-full bg-[#07090E] border border-slate-800/90 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 w-full">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                    <span>Password</span>
                    <span className="text-[10px] text-slate-500 font-mono">Bcrypt Hashed</span>
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 absolute left-3.5 text-slate-400 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password123!"
                      autoComplete="new-password"
                      required
                      className="w-full bg-[#07090E] border border-slate-800/90 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
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

                <Button 
                  type="submit" 
                  isLoading={isLoading} 
                  className="w-full mt-5 py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 rounded-xl" 
                  icon={ArrowRight}
                >
                  Sign In to Portal
                </Button>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800/80"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase">
                    <span className="bg-[#0E131F] px-3 text-slate-500 font-mono">Or Continue With</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleSignIn}
                  isLoading={isGoogleLoading}
                  className="w-full py-2.5 text-xs text-slate-200 border-slate-800 hover:bg-slate-900 bg-[#07090E] rounded-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Sign In with Google Identity</span>
                </Button>
              </motion.form>
            )}

            {/* TAB 2: CREATE ACCOUNT FORM */}
            {activeTab === 'register' && (
              <motion.form 
                key="register-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleRegisterSubmit} 
                autoComplete="off" 
                className="space-y-4"
              >
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
                      className="w-full bg-[#07090E] border border-slate-800/90 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
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
                      className="w-full bg-[#07090E] border border-slate-800/90 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
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
                      className="w-full bg-[#07090E] border border-slate-800/90 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
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
                      className="w-full bg-[#07090E] border border-slate-800/90 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
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

                <Button 
                  type="submit" 
                  isLoading={isRegLoading} 
                  className="w-full mt-5 py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/25" 
                  icon={ArrowRight}
                >
                  Verify & Create Account
                </Button>
              </motion.form>
            )}

            {/* TAB 3: PHONE NUMBER OTP LOGIN */}
            {activeTab === 'phone' && (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handleSendPhoneOtp} 
                className="space-y-4"
              >
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
                      className="w-full bg-[#07090E] border border-slate-800/90 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="text-xs text-slate-400 leading-relaxed bg-[#07090E] p-3.5 rounded-xl border border-slate-800/80 flex items-start gap-2.5">
                  <KeyRound className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    Enter registered mobile number. A 6-digit verification code will be sent. 
                    <span className="block mt-1 font-mono text-[11px] text-amber-300">
                      Demo OTP Code: <strong className="underline">123456</strong>
                    </span>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full mt-5 py-3 text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/25" 
                  icon={ArrowRight}
                >
                  Send Verification OTP Code
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 text-center pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 Encrypted Session</span>
            </span>
            <span>Enterprise ERP v1.0</span>
          </div>
        </div>
      </motion.div>

      {/* OTP VERIFICATION MODAL */}
      <AnimatePresence>
        {showOtpModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0E131F] border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl relative"
            >
              <div className="flex flex-col items-center text-center mb-5">
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
                  <ShieldCheck className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-white">Enter Verification Code</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter the 6-digit OTP code to complete authentication.
                </p>

                {/* 1-Click Demo OTP Auto Fill */}
                <button
                  type="button"
                  onClick={() => setOtpCode('123456')}
                  className="mt-3 text-xs font-mono bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-500/30 flex items-center gap-1.5 transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Click to Auto-fill Demo OTP: <strong>123456</strong></span>
                </button>
              </div>

              <div className="space-y-4">
                <input
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="123456"
                  autoFocus
                  className="w-full bg-[#07090E] border border-slate-700 rounded-xl px-4 py-3 text-center text-2xl font-mono text-white tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 py-2.5 text-xs border-slate-800" onClick={() => setShowOtpModal(false)}>
                    Cancel
                  </Button>
                  <Button className="flex-1 py-2.5 text-xs bg-blue-600 hover:bg-blue-500" onClick={handleVerifyOtp}>
                    Verify & Proceed
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
