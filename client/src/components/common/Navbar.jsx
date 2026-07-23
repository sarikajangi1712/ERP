import React, { useState } from 'react';
import { Sun, Moon, Bell, LogOut, Search, User, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';

export const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Low Stock Alert', desc: 'PLC Controller stock is below minimum threshold (4 left)', time: '10m ago', type: 'warning' },
    { id: 2, title: 'Challan Confirmed', desc: 'Sales Challan CHAL-20260722-0001 confirmed by Sarah', time: '1h ago', type: 'info' },
  ];

  return (
    <header className="h-16 bg-white dark:bg-[#111827] border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Global Search Bar */}
      <div className="relative w-80">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search customers, SKUs, invoices..."
          className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Toggle Light/Dark Theme"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-40">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 mb-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</h4>
                <Badge variant="info">2 New</Badge>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs">
                    <p className="font-bold text-slate-900 dark:text-slate-100">{n.title}</p>
                    <p className="text-slate-500 mt-0.5">{n.desc}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Profile / Logout */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-200 dark:border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold text-sm">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <button
            onClick={logout}
            className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
