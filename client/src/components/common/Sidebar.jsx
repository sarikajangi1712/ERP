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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'SALES';

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'User Management', path: '/users', icon: UserCheck, roles: ['ADMIN'] },
    { label: 'Customer CRM', path: '/customers', icon: Users, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Product Catalog', path: '/products', icon: Package, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Inventory Control', path: '/inventory', icon: Warehouse, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Sales Challans', path: '/challans', icon: FileSpreadsheet, roles: ['ADMIN', 'SALES', 'WAREHOUSE'] },
    { label: 'Tax Invoices', path: '/invoices', icon: Receipt, roles: ['ADMIN', 'SALES', 'ACCOUNTS'] },
    { label: 'CRM Follow-ups', path: '/followups', icon: PhoneCall, roles: ['ADMIN', 'SALES'] },
    { label: 'Analytics Reports', path: '/reports', icon: BarChart3, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
    { label: 'Audit Logs', path: '/audit-logs', icon: ShieldAlert, roles: ['ADMIN'] },
    { label: 'Settings', path: '/settings', icon: Settings, roles: ['ADMIN', 'SALES', 'WAREHOUSE', 'ACCOUNTS'] },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 shrink-0 z-30">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-200 dark:border-slate-800">
        <div className="p-2.5 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/30">
          <Boxes className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-base text-slate-900 dark:text-slate-100 leading-tight">MINI ERP + CRM</h1>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-500">Enterprise Portal</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map((link) => {
          if (!link.roles.includes(role)) return null;
          const Icon = link.icon;
          return (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
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
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </aside>
  );
};
