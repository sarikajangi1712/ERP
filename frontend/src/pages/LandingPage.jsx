import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Boxes, 
  ArrowRight, 
  Shield, 
  CheckCircle2, 
  Users, 
  Package, 
  Warehouse, 
  FileText, 
  TrendingUp, 
  Zap, 
  Building2, 
  Sparkles, 
  Menu, 
  X, 
  Check, 
  Database, 
  Server, 
  Activity, 
  Receipt,
  ShieldAlert,
  BarChart3,
  Layers,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  ArrowUpRight,
  Eye,
  Play,
  Pause,
  ArrowUp,
  Sliders,
  DollarSign
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';
import { Logo } from '../components/common/Logo';

// Demo quick-login roles with detailed privilege tags
const DEMO_ROLES = [
  {
    role: 'ADMIN',
    title: 'Admin Console',
    email: 'admin@erp.com',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'Full system oversight, audit trails, user access control & master data management.',
    permissions: ['User Management', 'Audit Trail Capture', 'System Settings', 'Global Reports']
  },
  {
    role: 'SALES',
    title: 'Sales & CRM',
    email: 'sales@erp.com',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Customer directory management, lead stages pipeline & draft sales challans.',
    permissions: ['Lead Stage Pipeline', 'Customer CRM Directory', 'Draft Sales Challans', 'Follow-up Schedule']
  },
  {
    role: 'WAREHOUSE',
    title: 'Warehouse Mgr',
    email: 'warehouse@erp.com',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'Multi-depot inventory tracking, stock transfers & negative inventory guards.',
    permissions: ['Multi-Depot Stock', 'Inter-Depot Transfers', 'Atomic Stock Adjustments', 'Low Stock Alerts']
  },
  {
    role: 'ACCOUNTS',
    title: 'Accounts Lead',
    email: 'accounts@erp.com',
    icon: FileText,
    color: 'from-purple-500 to-pink-600',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    desc: 'Tax invoice generation, payment tracking, printable invoices & GST summaries.',
    permissions: ['Tax Invoice Creation', 'Payment Reconciliation', 'GST Tax Reports', 'Printable PDF Invoices']
  }
];

// Key Modules Feature List
const FEATURES = [
  {
    icon: Shield,
    title: 'Multi-Role Security & JWT',
    desc: 'Dual-token architecture with refresh token rotation, bcrypt password hashing, and express rate-limiting.',
    tag: 'Authentication'
  },
  {
    icon: Users,
    title: 'Customer CRM Directory',
    desc: 'Lead stage pipeline (Prospect, Lead, Active, Inactive), contact notes timeline, and one-click CSV export.',
    tag: 'CRM'
  },
  {
    icon: Warehouse,
    title: 'Multi-Warehouse Inventory',
    desc: 'Atomic stock adjustments (Stock In/Out), inter-depot transfers, and negative inventory protection guards.',
    tag: 'Inventory'
  },
  {
    icon: Receipt,
    title: 'Sales Challans & Tax Invoices',
    desc: 'Draft challan builder with automatic stock deduction upon confirmation and one-click printable tax invoices.',
    tag: 'Operations'
  },
  {
    icon: BarChart3,
    title: 'Real-Time Financial Reports',
    desc: 'Sales performance analytics, inventory asset valuation reports, and audit-ready GST tax summaries.',
    tag: 'Analytics'
  },
  {
    icon: ShieldAlert,
    title: 'Enterprise Audit Trail',
    desc: 'System-wide activity logs capturing user ID, IP address, exact action type, and operational timestamp.',
    tag: 'Audit Logs'
  }
];

// Operational Workflow Steps with Detailed Interactive Previews
const WORKFLOW_STEPS = [
  {
    step: '01',
    title: 'CRM Lead Prospecting',
    module: 'CRM Module',
    icon: Users,
    desc: 'Sales rep creates customer record, logs follow-up notes, and advances stage from Prospect to Active Lead.',
    highlight: 'Instant lead conversion',
    previewData: {
      client: 'Apex Industrial Solutions',
      contact: 'Rajesh Sharma (Procurement Head)',
      stage: 'Prospect → Active Lead',
      actionLog: 'Added note: "Requested quote for 150 Valves & Actuators"'
    }
  },
  {
    step: '02',
    title: 'Draft Sales Challan',
    module: 'Sales & Inventory',
    icon: Receipt,
    desc: 'Select items from multi-depot inventory. System checks stock levels and builds itemized delivery challans.',
    highlight: 'Stock validation guards',
    previewData: {
      challanNo: 'CHAL-2026-0042',
      items: '150 x Heavy Duty Pneumatic Valves',
      stockStatus: 'Central Depot A: 820 units available',
      guardCheck: 'PASSED (Non-negative stock check)'
    }
  },
  {
    step: '03',
    title: 'Stock Allocation & Deduct',
    module: 'Warehouse',
    icon: Warehouse,
    desc: 'Confirming sales challan automatically deducts physical stock from designated warehouse depot atomically.',
    highlight: 'Atomic transactional update',
    previewData: {
      depot: 'Central Depot A',
      before: '820 Units',
      deducted: '-150 Units',
      after: '670 Units (Stock Locked atomically)'
    }
  },
  {
    step: '04',
    title: 'Tax Invoice & Audit Entry',
    module: 'Accounts & Security',
    icon: FileText,
    desc: 'Generate GST-compliant printable invoice with tax calculations while capturing full user audit logs.',
    highlight: 'GST compliant & audit-ready',
    previewData: {
      invoiceNo: 'INV-2026-881',
      taxableAmount: '₹2,45,000',
      gstTax: '₹44,100 (18% CGST/SGST)',
      auditCaptured: 'User #1 (Admin) | IP: 192.168.1.14 | Time: 00:42:10'
    }
  }
];

// FAQ List
const FAQS = [
  {
    q: 'How does multi-warehouse inventory management work?',
    a: 'The system allows you to create multiple physical warehouse depots. You can track exact SKU quantities per location, record incoming stock, perform stock transfers between depots with full transaction history, and prevent negative stock balances.'
  },
  {
    q: 'Is GST tax calculation automated for invoices?',
    a: 'Yes! When converting sales challans into final tax invoices, the system calculates taxable value, CGST, SGST, IGST, and generates audit-ready financial invoice PDFs formatted for distribution.'
  },
  {
    q: 'Can I restrict user access based on job roles?',
    a: 'Absolutely. Built-in Role-Based Access Control (RBAC) enforces strict route and API endpoint permissions for Admin, Sales, Warehouse, and Accounts roles.'
  },
  {
    q: 'How are system actions recorded in the audit trail?',
    a: 'Every critical operational action (create customer, update stock, confirm challan, generate invoice, change user role) is logged automatically with user ID, action type, client IP address, and timestamp.'
  },
  {
    q: 'Can this ERP-CRM suite be deployed using Docker?',
    a: 'Yes, full containerization specs with Dockerfile.frontend, Dockerfile.backend, and docker-compose.yml are pre-configured for instant multi-container deployment.'
  }
];

export const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [activeWorkflow, setActiveWorkflow] = useState(0);
  const [billingAnnual, setBillingAnnual] = useState(true);
  const [teamSize, setTeamSize] = useState(10);
  const [openFaq, setOpenFaq] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const apiDocsUrl = import.meta.env?.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '')}/api-docs`
    : `${typeof window !== 'undefined' ? window.location.protocol + '//' + window.location.hostname : ''}:5000/api-docs`;

  // Auto-play live tour cycle for system mockup
  useEffect(() => {
    if (!isAutoPlay) return;
    const tabs = ['overview', 'crm', 'inventory', 'challans', 'audit'];
    const timer = setInterval(() => {
      setActiveTab((prev) => {
        const nextIndex = (tabs.indexOf(prev) + 1) % tabs.length;
        return tabs[nextIndex];
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isAutoPlay]);

  // Back to top scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Quick Role Login Handler (Pre-fills email on Login page)
  const handleQuickRoleLogin = (item) => {
    navigate(`/login?email=${encodeURIComponent(item.email)}&role=${item.role}`);
  };

  return (
    <div className="min-h-screen bg-[#06080F] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Mesh Gradients & Ambient Glow Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.22),rgba(255,255,255,0))]" pointerEvents="none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370d_1px,transparent_1px),linear-gradient(to_bottom,#1f29370d_1px,transparent_1px)] bg-[size:4rem_4rem]" pointerEvents="none" />

      {/* Floating Ambient Glowing Orbs */}
      <div className="absolute top-20 left-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 w-72 sm:w-96 h-72 sm:h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* RESPONSIVE TOP NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#06080F]/90 border-b border-slate-800/80 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="group shrink-0">
            <Logo variant="full" size="md" title="MINI ERP" subtitle="+ CRM" />
          </Link>

          {/* Desktop Nav Links (Visible on XL screens) */}
          <nav className="hidden xl:flex items-center gap-5 lg:gap-7 text-xs font-semibold text-slate-300 whitespace-nowrap">
            <a href="#preview" className="hover:text-white transition-colors py-1">Live Demo</a>
            <a href="#demo-roles" className="hover:text-white transition-colors py-1">Roles</a>
            <a href="#workflow" className="hover:text-white transition-colors py-1">Workflow</a>
            <a href="#features" className="hover:text-white transition-colors py-1">Modules</a>
            <a href="#tech-stack" className="hover:text-white transition-colors py-1">Tech Stack</a>
            <a href="#pricing" className="hover:text-white transition-colors py-1">Pricing</a>
            <a href="#faq" className="hover:text-white transition-colors py-1">FAQ</a>
          </nav>

          {/* Action Buttons (Visible on LG+ screens) */}
          <div className="hidden lg:flex items-center gap-2.5 shrink-0">
            {user ? (
              <Button onClick={() => navigate('/dashboard')} icon={ArrowRight} className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 text-xs py-2 px-4">
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')} className="border-slate-800 text-slate-300 hover:bg-slate-900 hover:text-white text-xs py-2 px-3.5">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/login')} icon={ArrowRight} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/30 text-xs py-2 px-4 whitespace-nowrap">
                  Launch Portal
                </Button>
              </>
            )}
          </div>

          {/* Mobile/Tablet Menu Toggle (Visible on screens < XL) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2.5 rounded-2xl bg-slate-900/80 border border-slate-800/90 text-slate-300 hover:text-white hover:border-blue-500/40 transition-all shadow-md active:scale-95 shrink-0"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5 text-rose-400" /> : <Menu className="w-5 h-5 text-blue-400" />}
          </button>
        </div>

        {/* Mobile/Tablet Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="xl:hidden p-4 sm:p-5 bg-[#0A0D18]/98 backdrop-blur-2xl border-b border-slate-800/90 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] space-y-3 max-h-[85vh] overflow-y-auto"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {[
                  { name: 'Live System Preview', href: '#preview', icon: Eye, color: 'text-blue-400' },
                  { name: 'Role Demos', href: '#demo-roles', icon: Users, color: 'text-emerald-400' },
                  { name: 'Operational Workflow', href: '#workflow', icon: Layers, color: 'text-indigo-400' },
                  { name: 'Enterprise Modules', href: '#features', icon: Boxes, color: 'text-amber-400' },
                  { name: 'Tech Architecture', href: '#tech-stack', icon: Zap, color: 'text-purple-400' },
                  { name: 'Pricing Plans', href: '#pricing', icon: Sparkles, color: 'text-pink-400' },
                  { name: 'FAQ', href: '#faq', icon: HelpCircle, color: 'text-teal-400' },
                ].map((item) => {
                  const IconC = item.icon;
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800/60 text-slate-200 font-semibold text-xs sm:text-sm flex items-center justify-between transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${item.color}`}>
                          <IconC className="w-4 h-4" />
                        </div>
                        <span>{item.name}</span>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                    </a>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row gap-2.5">
                <Button 
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }} 
                  icon={ArrowRight} 
                  className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-500/30 justify-center"
                >
                  Launch Live Demo Portal
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 sm:space-y-6 max-w-4xl mx-auto"
        >
          {/* Status Badge Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[11px] sm:text-xs font-semibold tracking-wide shadow-lg shadow-blue-500/5 max-w-full overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <span className="font-mono text-emerald-400 font-bold shrink-0">OPERATIONAL v2.4</span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <span className="truncate">ENTERPRISE ERP + CRM SUITE</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.15] sm:leading-[1.1]">
            Unified Wholesale Operations, Multi-Depot Inventory & <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">CRM Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-lg text-slate-400 leading-relaxed max-w-3xl mx-auto px-2 sm:px-0">
            Empower sales, warehouse, and finance teams with real-time stock allocation, automated sales challans, tax invoices, and multi-role enterprise audit controls.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md sm:max-w-none mx-auto">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              icon={ArrowRight}
              className="w-full sm:w-auto text-xs sm:text-base py-3.5 sm:py-4 px-6 sm:px-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:opacity-95 text-white shadow-[0_0_35px_-5px_rgba(59,130,246,0.5)] rounded-2xl font-bold transition-all justify-center"
            >
              🚀 Launch Live Demo Portal
            </Button>
            <a
              href={apiDocsUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full text-xs sm:text-base py-3.5 sm:py-4 px-6 sm:px-7 border-slate-800 text-slate-300 hover:bg-slate-900/90 hover:text-white rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                <span>📖 Swagger API Docs</span>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </Button>
            </a>
          </div>

          {/* Key Feature Checks */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> PostgreSQL & Prisma DB</span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> 4 Demo Roles</span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> GST Tax Invoicing</span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Docker Ready</span>
          </div>
        </motion.div>

        {/* INTERACTIVE LIVE SYSTEM MOCKUP CARD */}
        <motion.div
          id="preview"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-10 sm:mt-16 max-w-5xl mx-auto rounded-3xl p-3 sm:p-5 bg-[#0B0F1D]/95 border border-slate-800/90 shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl relative ring-1 ring-white/10"
        >
          {/* Top Window Header Bar */}
          <div className="flex items-center justify-between gap-3 px-3.5 sm:px-4 py-2.5 bg-[#06080F] rounded-2xl border border-slate-800/90 mb-3 text-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              </div>
              <span className="font-mono text-slate-400 text-[10px] sm:text-xs truncate max-w-[180px] sm:max-w-none">{currentOrigin}/dashboard</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-bold">
                🟢 System Active
              </span>
              <button
                type="button"
                onClick={() => setIsAutoPlay(!isAutoPlay)}
                className={`px-2.5 sm:px-3 py-1 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 border transition-all ${
                  isAutoPlay 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm' 
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={isAutoPlay ? 'Pause Auto Tour' : 'Start Auto Tour'}
              >
                {isAutoPlay ? <Pause className="w-3 h-3 text-emerald-400" /> : <Play className="w-3 h-3" />}
                <span>{isAutoPlay ? 'Auto Tour: ON' : 'Auto Tour: OFF'}</span>
              </button>
            </div>
          </div>

          {/* Module Selector Full-Width Tab Grid (Zero Overflow / Cut-off) */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1.5 bg-[#06080F] rounded-2xl border border-slate-800/90 mb-4">
            {[
              { id: 'overview', label: '📊 Overview' },
              { id: 'crm', label: '👥 CRM Pipeline' },
              { id: 'inventory', label: '📦 Multi-Depot' },
              { id: 'challans', label: '📄 Challans & Tax' },
              { id: 'audit', label: '🛡️ Audit Trail' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsAutoPlay(false); // Pause auto tour on manual click
                }}
                className={`py-2 px-2 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold transition-all text-center truncate ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/30 ring-1 ring-white/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB CONTENT PANELS */}
          <div className="min-h-[200px] text-left">
            <AnimatePresence mode="wait">
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
                >
                  <div className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-blue-500/40 transition-all space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Active Customers</span>
                      <Users className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white">2,845</div>
                    <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> +14.2% lead conversion
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-indigo-500/40 transition-all space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Stock Master SKUs</span>
                      <Package className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white">1,420</div>
                    <div className="text-[10px] text-slate-400">across 4 physical depots</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Asset Valuation</span>
                      <Warehouse className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white">₹48.2L</div>
                    <div className="text-[10px] text-emerald-400 font-semibold">Real-time valuation balance</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-amber-500/40 transition-all space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                      <span>Revenue Realized</span>
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-white">₹1.28Cr</div>
                    <div className="text-[10px] text-amber-400 font-semibold">Confirmed GST challans</div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'crm' && (
                <motion.div
                  key="crm"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs sm:text-sm text-white">Customer CRM Directory</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                      Pipeline View
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Prospects</span>
                      <span className="text-base sm:text-lg font-bold text-white block mt-0.5">142 Leads</span>
                      <span className="text-[10px] text-slate-400">Initial contact stage</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Active Buyers</span>
                      <span className="text-base sm:text-lg font-bold text-emerald-400 block mt-0.5">2,703 Accounts</span>
                      <span className="text-[10px] text-emerald-400/80">Recurring orders</span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase tracking-wider">Notes & Timeline</span>
                      <span className="text-base sm:text-lg font-bold text-blue-400 block mt-0.5">854 Logs</span>
                      <span className="text-[10px] text-slate-400">Follow-up history</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'inventory' && (
                <motion.div
                  key="inventory"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Warehouse className="w-4 h-4 text-indigo-400" />
                      <span className="font-bold text-xs sm:text-sm text-white">Multi-Warehouse Stock Monitor</span>
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      Transfer Engine Active
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Central Depot A</span>
                      <span className="text-base font-extrabold text-white">820 Units</span>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }} />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">North Hub B</span>
                      <span className="text-base font-extrabold text-white">340 Units</span>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: '60%' }} />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">West Hub C</span>
                      <span className="text-base font-extrabold text-white">195 Units</span>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2">
                        <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '40%' }} />
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <span className="text-slate-400 text-[10px] block">Inter-Depot Transfers</span>
                      <span className="text-base font-extrabold text-emerald-400">12 Active</span>
                      <span className="text-[10px] text-slate-400 block mt-1">Atomic stock lock</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'challans' && (
                <motion.div
                  key="challans"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <Receipt className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs sm:text-sm text-white">Sales Challans & Tax Invoicing</span>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      GST Compliant
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-white block">Sales Challan #CH-9402</span>
                        <span className="text-slate-400 text-[10px]">Apex Traders • 120 Industrial Valves</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 w-fit">
                        CONFIRMED & DEDUCTED
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-white block">Tax Invoice #INV-2026-881</span>
                        <span className="text-slate-400 text-[10px]">Taxable: ₹2,45,000 | GST 18%: ₹44,100</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 w-fit">
                        PRINTABLE TAX PDF
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'audit' && (
                <motion.div
                  key="audit"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="p-4 rounded-2xl bg-[#0E1424] border border-slate-800/90 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-xs sm:text-sm text-white">Enterprise Audit Log Traceability</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                      IP & User Captured
                    </span>
                  </div>
                  <div className="space-y-2 font-mono text-[10px] sm:text-[11px] overflow-x-auto">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between min-w-[500px] text-slate-300">
                      <span className="text-blue-400">[2026-07-24 00:42]</span>
                      <span>User #1 (Admin)</span>
                      <span className="text-emerald-400">CHALLAN_CONFIRM</span>
                      <span className="text-slate-500">IP: 192.168.1.14</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800/80 flex items-center justify-between min-w-[500px] text-slate-300">
                      <span className="text-blue-400">[2026-07-24 00:39]</span>
                      <span>User #3 (Warehouse)</span>
                      <span className="text-amber-400">STOCK_TRANSFER</span>
                      <span className="text-slate-500">IP: 192.168.1.28</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      {/* SYSTEM METRICS & PERFORMANCE BANNER */}
      <section className="py-10 border-y border-slate-800/80 bg-[#070A14]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">99.98%</div>
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
              <Activity className="w-3.5 h-3.5 text-emerald-400" /> Uptime SLA Guaranteed
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">&lt; 50ms</div>
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> REST API Response Latency
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">100%</div>
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5 text-blue-400" /> Audit Log Trace Coverage
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-black text-white font-mono">10,000+</div>
            <div className="text-xs text-slate-400 font-semibold flex items-center justify-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-purple-400" /> Daily Challans Generated
            </div>
          </div>
        </div>
      </section>

      {/* ⚡ ROLE-BASED ACCESS DEMO SECTION */}
      <section id="demo-roles" className="py-16 sm:py-20 bg-[#0A0D18]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              ⚡ One-Click Quick Role Access
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">Experience Role-Based Security</h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Click any role card below to instantly pre-fill credentials and test authorized enterprise module views.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {DEMO_ROLES.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.role}
                  className="p-5 sm:p-6 rounded-3xl bg-[#0E1424] border border-slate-800/90 hover:border-blue-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-5 group shadow-lg"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 text-white shadow-sm">
                        <IconComp className="w-5 h-5 text-blue-400" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${item.badge}`}>
                        {item.role}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    {/* Permissions List */}
                    <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                      {item.permissions.map((perm, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-300">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{perm}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <Button
                      onClick={() => handleQuickRoleLogin(item)}
                      icon={ArrowRight}
                      className="w-full text-xs py-2.5 bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-800 transition-all font-semibold rounded-xl justify-center group-hover:bg-blue-600 group-hover:text-white"
                    >
                      Login as {item.title}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* INTERACTIVE WORKFLOW SHOWCASE WITH STEP PREVIEW */}
      <section id="workflow" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            🔄 End-to-End Operational Lifecycle
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">How Mini ERP + CRM Works</h2>
          <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto">
            Click any step below to explore the live operational data transformation.
          </p>
        </div>

        {/* 4 Interactive Workflow Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {WORKFLOW_STEPS.map((wf, idx) => {
            const IconC = wf.icon;
            const isSelected = activeWorkflow === idx;
            return (
              <div
                key={wf.step}
                onClick={() => setActiveWorkflow(idx)}
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 cursor-pointer space-y-3.5 ${
                  isSelected
                    ? 'bg-[#0E1424] border-blue-500 shadow-[0_0_30px_-5px_rgba(59,130,246,0.35)] ring-1 ring-blue-500/50'
                    : 'bg-[#0A0D18] border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg sm:text-xl font-black text-blue-400">{wf.step}</span>
                  <div className={`p-2 sm:p-2.5 rounded-xl border ${isSelected ? 'bg-blue-600 text-white border-blue-400' : 'bg-slate-900 text-slate-400 border-slate-800'}`}>
                    <IconC className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">{wf.module}</span>
                  <h3 className="font-bold text-sm sm:text-base text-white mt-0.5">{wf.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{wf.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                  <span className="text-emerald-400 font-semibold">{wf.highlight}</span>
                  <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-blue-400 translate-x-1' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* STEP LIVE PREVIEW SHOWCASE BOX */}
        <motion.div
          key={activeWorkflow}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-6 rounded-3xl bg-[#0E1424] border border-blue-500/40 shadow-xl max-w-4xl mx-auto space-y-4 text-left"
        >
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-xl bg-blue-600 text-white font-mono font-bold text-xs">
                Step {WORKFLOW_STEPS[activeWorkflow].step}
              </span>
              <h4 className="font-bold text-base text-white">
                {WORKFLOW_STEPS[activeWorkflow].title} Live Data Stream
              </h4>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
              🟢 {WORKFLOW_STEPS[activeWorkflow].module}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
            {Object.entries(WORKFLOW_STEPS[activeWorkflow].previewData).map(([key, val]) => (
              <div key={key} className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800/80 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block">{key}</span>
                <span className="text-slate-200 font-bold block">{val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* MODULES & FEATURES GRID */}
      <section id="features" className="py-16 sm:py-20 bg-[#0A0D18]/80 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-3">
            <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
              🌟 Complete Enterprise Capabilities
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">Engineered for Wholesale Operations</h2>
            <p className="text-xs sm:text-base text-slate-400 max-w-2xl mx-auto">
              From atomic multi-depot stock transfers to automated GST tax invoicing, every module is optimized for maximum speed and data integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {FEATURES.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div 
                  key={idx}
                  className="p-5 sm:p-6 rounded-3xl bg-[#0E1424] border border-slate-800/90 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300 space-y-3.5 group shadow-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 sm:p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                      <IconComp className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900 px-2 py-0.5 sm:py-1 rounded-md border border-slate-800">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TECH STACK & SYSTEM SPECS */}
      <section id="tech-stack" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-5 space-y-4 text-left">
            <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              🛠️ Modern Tech Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight tracking-tight">
              Built on Enterprise React, Node & PostgreSQL
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed pt-1">
              Powered by a high-throughput Express REST API backend and Prisma ORM, coupled with a fast Vite React single-page application frontend.
            </p>
            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> PostgreSQL 16 relational integrity with Prisma 5 schema
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> TanStack React Query v5 data fetching & cache management
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" /> Docker Compose unified multi-containerization
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2 text-left">
              <Database className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
              <h4 className="font-bold text-sm text-white">PostgreSQL 16</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Atomic transactions & Neon serverless database ready.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2 text-left">
              <Server className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
              <h4 className="font-bold text-sm text-white">Node.js + Express</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Modular REST controllers with Winston logging & Swagger docs.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2 text-left">
              <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
              <h4 className="font-bold text-sm text-white">React 18 + Vite</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Ultra-fast page loads, Tailwind CSS styling & Lucide icons.</p>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#0E1424] border border-slate-800/90 hover:border-slate-700 transition-colors space-y-2 text-left">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400" />
              <h4 className="font-bold text-sm text-white">JWT + Bcrypt Security</h4>
              <p className="text-xs text-slate-400 leading-relaxed">Multi-role authentication guards with IP audit log capture.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS WITH TEAM SIZE SLIDER */}
      <section id="pricing" className="py-16 sm:py-20 bg-[#0A0D18]/80 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 space-y-3.5">
            <span className="px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
              💳 Flexible Enterprise Deployment
            </span>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">Transparent Pricing for Growing Teams</h2>
            <p className="text-xs sm:text-sm text-slate-400">Choose the right plan to scale your wholesale and distribution workflow.</p>

            {/* Billing Toggle Switch & Team Slider */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center justify-center gap-3">
                <span className={`text-xs font-semibold ${!billingAnnual ? 'text-white' : 'text-slate-400'}`}>Monthly Billing</span>
                <button
                  type="button"
                  onClick={() => setBillingAnnual(!billingAnnual)}
                  className="w-12 h-6 rounded-full bg-slate-800 border border-slate-700 p-1 flex items-center transition-colors relative"
                >
                  <motion.div
                    className="w-4 h-4 rounded-full bg-blue-500"
                    animate={{ x: billingAnnual ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xs font-semibold ${billingAnnual ? 'text-white' : 'text-slate-400'}`}>Billed Annually</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Save 20%
                  </span>
                </div>
              </div>

              {/* Team Size Slider */}
              <div className="flex items-center gap-3 bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl">
                <Sliders className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">Team Size: <strong>{teamSize} Users</strong></span>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-24 accent-blue-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left items-stretch">
            {[
              {
                name: 'Starter Depot',
                priceMonthly: '₹2,999',
                priceAnnual: '₹2,399',
                period: '/ month',
                desc: 'Ideal for growing wholesale distributors needing core inventory & CRM.',
                features: ['Up to 5 User Accounts', '1 Central Warehouse Depot', 'Customer CRM & Sales Challans', 'Standard Financial Reports', 'Email Support'],
                isPopular: teamSize <= 5,
                cta: 'Get Started'
              },
              {
                name: 'Enterprise Pro',
                priceMonthly: '₹7,999',
                priceAnnual: '₹6,399',
                period: '/ month',
                desc: 'Complete full-stack operations suite for multi-branch enterprises.',
                features: ['Unlimited User Accounts', 'Multi-Warehouse Depot Control', 'Tax Invoices & GST Summaries', 'Real-Time Audit Trail', 'Priority 24/7 SLA Support'],
                isPopular: teamSize > 5 && teamSize <= 25,
                cta: 'Launch Free Trial'
              },
              {
                name: 'Custom Infrastructure',
                priceMonthly: 'Custom',
                priceAnnual: 'Custom',
                period: '/ instance',
                desc: 'Dedicated Neon PostgreSQL DB, custom SLA, & Cloudinary CDN integration.',
                features: ['Dedicated Neon DB Instance', 'Custom ERP/CRM Workflows', 'On-Premise / Docker Deploy', 'Dedicated Account Manager', 'Custom API Integrations'],
                isPopular: teamSize > 25,
                cta: 'Contact Enterprise Sales'
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`p-6 sm:p-8 rounded-3xl bg-[#0E1424] border flex flex-col justify-between space-y-6 relative transition-all duration-300 ${
                  plan.isPopular 
                    ? 'border-blue-500/80 shadow-[0_0_40px_-10px_rgba(59,130,246,0.35)] ring-1 ring-blue-500/50' 
                    : 'border-slate-800/90 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <span className="absolute -top-3.5 right-6 px-3.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-blue-600 text-white shadow-lg">
                    Recommended for {teamSize} Users
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{plan.desc}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white">
                      {billingAnnual ? plan.priceAnnual : plan.priceMonthly}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{plan.period}</span>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
                    {plan.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/login')}
                  variant={plan.isPopular ? 'primary' : 'outline'}
                  className={`w-full py-3 text-xs font-bold rounded-xl justify-center ${
                    plan.isPopular ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25' : 'border-slate-800 text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) ACCORDION */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-wider">
            💬 Got Questions?
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Frequently Asked Questions</h2>
          <p className="text-xs sm:text-sm text-slate-400">Everything you need to know about setting up and running Mini ERP + CRM.</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#0E1424] border border-slate-800/90 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-bold text-white hover:text-blue-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="px-4 sm:px-5 pb-4 sm:pb-5 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-10 sm:py-12 bg-[#06080F] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <Logo variant="full" size="md" title="MINI ERP" subtitle="+ CRM Operations Platform" />

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-400 text-xs font-medium">
            <Link to="/login" className="hover:text-white transition-colors">Sign In Portal</Link>
            <a href={apiDocsUrl} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Swagger API Specs</a>
            <a href="#features" className="hover:text-white transition-colors">Modules</a>
            <a href="#demo-roles" className="hover:text-white transition-colors">Role Demos</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </div>

          <div className="text-[11px] text-slate-500 font-mono">
            © {new Date().getFullYear()} Mini ERP + CRM Enterprise. All rights reserved.
          </div>
        </div>
      </footer>

      {/* FLOATING QUICK-ACTION & BACK TO TOP BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-2"
          >
            <Button
              onClick={() => navigate('/login')}
              icon={ArrowRight}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs py-2.5 px-4 rounded-2xl shadow-xl shadow-blue-500/30"
            >
              Demo Portal
            </Button>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500/50 transition-all shadow-xl backdrop-blur-lg"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4 text-blue-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;
