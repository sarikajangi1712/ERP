import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  Sun, 
  Moon, 
  Menu, 
  X, 
  Check, 
  Database, 
  Server, 
  Activity, 
  Receipt,
  PhoneCall,
  ShieldAlert,
  BarChart3
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/common/Button';

// Demo quick-login roles
const DEMO_ROLES = [
  {
    role: 'ADMIN',
    title: 'Admin Console',
    email: 'admin@erp.com',
    icon: Building2,
    color: 'from-blue-500 to-indigo-600',
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    desc: 'Full system oversight, audit trails & master data control'
  },
  {
    role: 'SALES',
    title: 'Sales & CRM',
    email: 'sales@erp.com',
    icon: Users,
    color: 'from-emerald-500 to-teal-600',
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    desc: 'Customer directory, lead stages & draft sales challans'
  },
  {
    role: 'WAREHOUSE',
    title: 'Warehouse Mgr',
    email: 'warehouse@erp.com',
    icon: Package,
    color: 'from-amber-500 to-orange-600',
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    desc: 'Multi-depot inventory, stock transfers & movement audit'
  },
  {
    role: 'ACCOUNTS',
    title: 'Accounts Lead',
    email: 'accounts@erp.com',
    icon: FileText,
    color: 'from-purple-500 to-pink-600',
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    desc: 'Tax invoice generation, payment tracking & GST summaries'
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

// Pricing Plans
const PRICING_PLANS = [
  {
    name: 'Starter Depot',
    price: '₹2,999',
    period: '/ month',
    desc: 'Ideal for growing wholesale distributors needing core inventory & CRM.',
    features: ['Up to 5 User Accounts', '1 Central Warehouse Depot', 'Customer CRM & Sales Challans', 'Standard Financial Reports', 'Email Support'],
    isPopular: false,
    cta: 'Get Started'
  },
  {
    name: 'Enterprise Pro',
    price: '₹7,999',
    period: '/ month',
    desc: 'Complete full-stack operations suite for multi-branch enterprises.',
    features: ['Unlimited User Accounts', 'Multi-Warehouse Depot Control', 'Tax Invoices & GST Summaries', 'Real-Time Audit Trail', 'Priority 24/7 SLA Support'],
    isPopular: true,
    cta: 'Launch Free Trial'
  },
  {
    name: 'Custom Infrastructure',
    price: 'Custom',
    period: '/ instance',
    desc: 'Dedicated Neon PostgreSQL DB, custom SLA, & Cloudinary CDN integration.',
    features: ['Dedicated Neon DB Instance', 'Custom ERP/CRM Workflows', 'On-Premise / Docker Deploy', 'Dedicated Account Manager', 'Custom API Integrations'],
    isPopular: false,
    cta: 'Contact Enterprise Sales'
  }
];

export const LandingPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
      {/* Background Gradients & Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]" pointerEvents="none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370f_1px,transparent_1px),linear-gradient(to_bottom,#1f29370f_1px,transparent_1px)] bg-[size:4rem_4rem]" pointerEvents="none" />

      {/* Floating Ambient Orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute top-1/3 right-10 w-96 h-96 bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* TOP NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#07090E]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Boxes className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block">
                MINI ERP <span className="text-blue-500">+ CRM</span>
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 block -mt-1">
                Enterprise Operations Hub
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Modules</a>
            <a href="#demo-roles" className="hover:text-white transition-colors">Role Demos</a>
            <a href="#tech-stack" className="hover:text-white transition-colors">Tech Stack</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-300" />}
            </button>

            {user ? (
              <Button onClick={() => navigate('/dashboard')} icon={ArrowRight}>
                Go to Dashboard
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')} className="border-slate-800 text-slate-300 hover:bg-slate-900">
                  Sign In
                </Button>
                <Button onClick={() => navigate('/login')} icon={ArrowRight} className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25">
                  Launch Portal
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden p-4 bg-[#0E131F] border-b border-slate-800 space-y-3">
            <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300">Modules</a>
            <a href="#demo-roles" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300">Role Demos</a>
            <a href="#tech-stack" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300">Tech Stack</a>
            <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block text-sm text-slate-300">Pricing</a>
            <div className="pt-3 border-t border-slate-800 flex gap-2">
              <Button onClick={() => navigate('/login')} icon={ArrowRight} className="w-full">
                Launch Portal
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 sm:pt-20 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide shadow-lg shadow-blue-500/5">
            <Sparkles className="w-4 h-4 text-blue-400 animate-spin-slow" />
            <span>ENTERPRISE ERP + CRM SUITE V2.0</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Unified Wholesale Operations, Inventory & <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">CRM Intelligence</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Empower sales, warehouse, and finance teams with real-time stock allocation, automated sales challans, tax invoices, and multi-role audit controls.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              size="lg"
              onClick={() => navigate('/login')}
              icon={ArrowRight}
              className="w-full sm:w-auto text-base py-3.5 px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-xl shadow-blue-500/30 rounded-2xl"
            >
              🚀 Launch Live Demo Portal
            </Button>
            <a
              href="http://localhost:5000/api-docs"
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full text-base py-3.5 px-6 border-slate-800 text-slate-300 hover:bg-slate-900 rounded-2xl"
              >
                📖 Swagger API Docs
              </Button>
            </a>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> PostgreSQL & Prisma DB</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> 4 Demo Roles Ready</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Docker & Node.js Ready</span>
          </div>
        </motion.div>

        {/* HERO MOCKUP CARD */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 sm:mt-16 max-w-5xl mx-auto rounded-3xl p-3 sm:p-4 bg-slate-900/60 border border-slate-800/80 shadow-2xl backdrop-blur-2xl relative"
        >
          {/* Glass Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0B0F19] rounded-2xl border border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-mono text-xs text-slate-400">http://localhost:3000/dashboard</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              🟢 Live Application Ready
            </span>
          </div>

          {/* Mockup KPI Stats Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
            <div className="p-4 rounded-2xl bg-[#0E131F] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Active Customers</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">2,845</div>
              <span className="text-[10px] text-emerald-400 font-semibold">+14.2% this month</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Stock Master SKUs</span>
                <Package className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">1,420</div>
              <span className="text-[10px] text-slate-400">across 4 depots</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Asset Valuation</span>
                <Warehouse className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">₹48.2L</div>
              <span className="text-[10px] text-emerald-400 font-semibold">Real-time audit balance</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0E131F] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Revenue Realized</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-white mt-1">₹1.28Cr</div>
              <span className="text-[10px] text-amber-400 font-semibold">Confirmed challans</span>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ⚡ 1-CLICK QUICK DEMO ROLES SECTION */}
      <section id="demo-roles" className="py-16 bg-[#0B0F19]/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              ⚡ 1-Click Role Exploration
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Experience Role-Based Dashboards</h2>
            <p className="text-sm text-slate-400">
              Click any role card below to immediately log in and explore module permissions customized for that role.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_ROLES.map((item) => {
              const IconComp = item.icon;
              return (
                <div
                  key={item.role}
                  className="p-5 rounded-3xl bg-[#0E131F] border border-slate-800/80 hover:border-blue-500/50 transition-all flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-white">
                        <IconComp className="w-6 h-6 text-blue-400" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${item.badge}`}>
                        {item.role}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80">
                    <Button
                      onClick={() => navigate('/login')}
                      icon={ArrowRight}
                      className="w-full text-xs py-2.5 bg-slate-900 hover:bg-blue-600 text-slate-200 hover:text-white border border-slate-800 transition-colors"
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

      {/* MODULES & FEATURES GRID */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            🌟 Complete Enterprise Suite
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Wholesale Operations</h2>
          <p className="text-sm text-slate-400">
            From atomic multi-depot stock transfers to automated GST tax invoicing, every module is designed for maximum speed and data integrity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-[#0E131F]/90 border border-slate-800/80 hover:border-slate-700 transition-all space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20">
                    <IconComp className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TECH STACK & SYSTEM SPECS */}
      <section id="tech-stack" className="py-16 bg-[#0B0F19]/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                🛠️ Modern Tech Architecture
              </span>
              <h2 className="text-3xl font-extrabold text-white leading-tight">
                Built on Enterprise React, Node & PostgreSQL
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Powered by a high-throughput Express REST API backend and Prisma ORM, coupled with a fast Vite React single-page application frontend.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400" /> PostgreSQL 16 relational integrity with Prisma 5 schema
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400" /> TanStack React Query v5 data fetching & cache management
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <Check className="w-4 h-4 text-emerald-400" /> Docker Compose unified containerization
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-2">
                <Database className="w-6 h-6 text-blue-400" />
                <h4 className="font-bold text-sm text-white">PostgreSQL 16</h4>
                <p className="text-xs text-slate-400">Atomic transactions & Neon serverless database ready.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-2">
                <Server className="w-6 h-6 text-indigo-400" />
                <h4 className="font-bold text-sm text-white">Node.js + Express</h4>
                <p className="text-xs text-slate-400">Modular REST controllers with Winston logging & Swagger docs.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-2">
                <Activity className="w-6 h-6 text-emerald-400" />
                <h4 className="font-bold text-sm text-white">React 18 + Vite</h4>
                <p className="text-xs text-slate-400">Ultra-fast page loads, Tailwind CSS styling & Lucide icons.</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#0E131F] border border-slate-800 space-y-2">
                <Shield className="w-6 h-6 text-amber-400" />
                <h4 className="font-bold text-sm text-white">JWT + Bcrypt</h4>
                <p className="text-xs text-slate-400">Multi-role authentication guards with audit log capture.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING PLANS */}
      <section id="pricing" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
            💳 Flexible Deployment
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Transparent Pricing for Growing Teams</h2>
          <p className="text-sm text-slate-400">Choose the right plan to scale your wholesale and distribution workflow.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PRICING_PLANS.map((plan, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-3xl bg-[#0E131F] border flex flex-col justify-between space-y-6 relative ${
                plan.isPopular ? 'border-blue-500 shadow-xl shadow-blue-500/10 ring-1 ring-blue-500/50' : 'border-slate-800'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 right-6 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-md">
                  Most Popular
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{plan.price}</span>
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
                className="w-full py-3 text-xs font-bold rounded-xl"
              >
                {plan.cta}
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-12 bg-[#07090E] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white">
              <Boxes className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-200">MINI ERP + CRM Operations Platform</p>
              <p className="text-[10px] text-slate-400">© 2026 Enterprise Systems Inc. All rights reserved.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-slate-400">
            <Link to="/login" className="hover:text-white transition-colors">Sign In Portal</Link>
            <a href="http://localhost:5000/api-docs" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">API Specs</a>
            <a href="#features" className="hover:text-white transition-colors">Modules</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
