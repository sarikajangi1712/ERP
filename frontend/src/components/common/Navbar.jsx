import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Search, Menu, Globe, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Badge } from './Badge';
import { Button } from './Button';

export const Navbar = ({ onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const notifications = [
    { id: 1, title: 'Low Stock Alert', desc: 'PLC Controller stock is below minimum threshold (4 left)', time: '10m ago', type: 'warning' },
    { id: 2, title: 'Challan Confirmed', desc: 'Sales Challan CHAL-20260722-0001 confirmed by Sarah', time: '1h ago', type: 'info' },
  ];

  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      setShowLogoutModal(false);
      setIsLoggingOut(false);
      navigate('/');
    }, 1200);
  };

  return (
    <>
      <header className="h-16 bg-white/80 dark:bg-[#0B0F19]/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-20 w-full shadow-sm">
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search Bar (Responsive Width) */}
          <div className="relative w-44 sm:w-64 md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search customers, SKUs, invoices..."
              className="w-full bg-slate-100 dark:bg-[#07090E] border border-slate-200 dark:border-slate-800/90 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3">
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
              <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-4 z-40 max-w-[calc(100vw-2rem)]">
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
          <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold text-xs sm:text-sm">
              {user?.name ? user.name[0] : 'U'}
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="p-1.5 sm:p-2 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Logout Confirmation & Notification Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-md" 
            onClick={() => !isLoggingOut && setShowLogoutModal(false)} 
          />

          <div className="relative z-10 w-full max-w-md bg-[#0E131F] border border-slate-800/90 rounded-3xl shadow-2xl overflow-hidden p-6 space-y-5 text-center">
            {/* Header domain badge */}
            <div className="flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono font-bold w-fit mx-auto">
              <Globe className="w-3.5 h-3.5" />
              <span>www.ERP + CRM Portal.com says</span>
            </div>

            {isLoggingOut ? (
              <div className="py-6 space-y-3">
                <Loader2 className="w-10 h-10 text-rose-500 animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Logging out...</h3>
                <p className="text-xs text-slate-400">Terminating session and opening main landing page.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/20">
                  <LogOut className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white">Logging out</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Are you sure you want to log out of your session on <strong className="text-slate-200">www.ERP + CRM Portal.com</strong>?
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button variant="outline" onClick={() => setShowLogoutModal(false)} className="w-1/2 py-2.5">
                    Cancel
                  </Button>
                  <Button variant="danger" icon={LogOut} onClick={handleConfirmLogout} className="w-1/2 py-2.5">
                    Logging out
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
