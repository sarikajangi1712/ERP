import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Package,
  Warehouse,
  FileSpreadsheet,
  Receipt,
  PhoneCall,
  BarChart3,
  ShieldAlert,
  Settings,
  Boxes,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Logo } from './Logo';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const role = user?.role || 'SALES';

  const links = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
      activeStyle: 'bg-gradient-to-r from-cyan-500/20 via-blue-600/15 to-transparent text-cyan-400 border-l-4 border-cyan-400 shadow-lg shadow-cyan-500/10 font-extrabold pl-3'
    },
    { 
      label: 'User Management', 
      path: '/users', 
      icon: UserCheck, 
      roles: ['ADMIN'],
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
      activeStyle: 'bg-gradient-to-r from-emerald-500/20 via-teal-600/15 to-transparent text-emerald-400 border-l-4 border-emerald-400 shadow-lg shadow-emerald-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Customer CRM', 
      path: '/customers', 
      icon: Users, 
      roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10 border-blue-500/20',
      activeStyle: 'bg-gradient-to-r from-blue-500/20 via-indigo-600/15 to-transparent text-blue-400 border-l-4 border-blue-400 shadow-lg shadow-blue-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Product Catalog', 
      path: '/products', 
      icon: Package, 
      roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
      activeStyle: 'bg-gradient-to-r from-amber-500/20 via-yellow-600/15 to-transparent text-amber-400 border-l-4 border-amber-400 shadow-lg shadow-amber-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Inventory Control', 
      path: '/inventory', 
      icon: Warehouse, 
      roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10 border-purple-500/20',
      activeStyle: 'bg-gradient-to-r from-purple-500/20 via-violet-600/15 to-transparent text-purple-400 border-l-4 border-purple-400 shadow-lg shadow-purple-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Sales Challans', 
      path: '/challans', 
      icon: FileSpreadsheet, 
      roles: ['ADMIN', 'SALES', 'WAREHOUSE'],
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10 border-rose-500/20',
      activeStyle: 'bg-gradient-to-r from-rose-500/20 via-pink-600/15 to-transparent text-rose-400 border-l-4 border-rose-400 shadow-lg shadow-rose-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Tax Invoices', 
      path: '/invoices', 
      icon: Receipt, 
      roles: ['ADMIN', 'SALES', 'ACCOUNTS'],
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/20',
      activeStyle: 'bg-gradient-to-r from-teal-500/20 via-emerald-600/15 to-transparent text-teal-400 border-l-4 border-teal-400 shadow-lg shadow-teal-500/10 font-extrabold pl-3'
    },
    { 
      label: 'CRM Follow-ups', 
      path: '/followups', 
      icon: PhoneCall, 
      roles: ['ADMIN', 'SALES'],
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10 border-orange-500/20',
      activeStyle: 'bg-gradient-to-r from-orange-500/20 via-amber-600/15 to-transparent text-orange-400 border-l-4 border-orange-400 shadow-lg shadow-orange-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Analytics Reports', 
      path: '/reports', 
      icon: BarChart3, 
      roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
      color: 'text-fuchsia-400',
      bgColor: 'bg-fuchsia-500/10 border-fuchsia-500/20',
      activeStyle: 'bg-gradient-to-r from-fuchsia-500/20 via-pink-600/15 to-transparent text-fuchsia-400 border-l-4 border-fuchsia-400 shadow-lg shadow-fuchsia-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Audit Logs', 
      path: '/audit-logs', 
      icon: ShieldAlert, 
      roles: ['ADMIN'],
      color: 'text-red-400',
      bgColor: 'bg-red-500/10 border-red-500/20',
      activeStyle: 'bg-gradient-to-r from-red-500/20 via-rose-600/15 to-transparent text-red-400 border-l-4 border-red-400 shadow-lg shadow-red-500/10 font-extrabold pl-3'
    },
    { 
      label: 'Settings', 
      path: '/settings', 
      icon: Settings, 
      roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'],
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/20',
      activeStyle: 'bg-gradient-to-r from-indigo-500/20 via-blue-600/15 to-transparent text-indigo-400 border-l-4 border-indigo-400 shadow-lg shadow-indigo-500/10 font-extrabold pl-3'
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-[#0B0F19] border-r border-slate-200 dark:border-slate-800/90 w-64 shadow-2xl lg:shadow-none">
      {/* Brand Header */}
      <div className="p-4 sm:p-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80">
        <Logo variant="full" size="md" title="MINI ERP" subtitle="+ CRM Enterprise" />

        {/* Mobile Close Button */}
        <button 
          onClick={onCloseMobile}
          className="lg:hidden p-1.5 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        {links.map((link) => {
          if (!link.roles.includes(role)) return null;
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200 group ${
                  isActive
                    ? link.activeStyle
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-100'
                }`
              }
            >
              <div className={`p-2 rounded-xl border transition-transform group-hover:scale-110 ${link.bgColor} ${link.color}`}>
                <Icon className="w-4 h-4 shrink-0" />
              </div>
              <span className="tracking-wide">{link.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Role Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/60 flex items-center justify-between">
          <div className="truncate">
            <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">{user?.role}</p>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0 ml-2" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block h-screen sticky top-0 shrink-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop Overlay & Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Blur */}
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity" 
            onClick={onCloseMobile}
          />
          {/* Drawer Panel */}
          <div className="relative z-10 h-full max-w-xs w-full animate-slideInLeft">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
