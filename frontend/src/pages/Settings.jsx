import React, { useState, useRef } from 'react';
import { Key, User, ShieldCheck, Database, Server, Clock, Lock, CheckCircle2, Globe, Cpu, Camera, Upload, X, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';

export const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Avatar / Profile Photo State
  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem('userAvatarUrl') || null);
  const [avatarDragActive, setAvatarDragActive] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await authApi.changePassword({ currentPassword, newPassword });
      showToast('Account password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      showToast(err.response?.data?.message || 'Password update failed', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const processAvatarFile = (file) => {
    if (!file) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      showToast('Only JPG, PNG, GIF, or WEBP images are supported.', 'error');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be smaller than 5 MB.', 'error');
      return;
    }

    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setAvatarUrl(dataUrl);
      localStorage.setItem('userAvatarUrl', dataUrl);
      setIsUploadingAvatar(false);
      showToast('Profile photo updated successfully!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    processAvatarFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setAvatarDragActive(false);
    const file = e.dataTransfer.files?.[0];
    processAvatarFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setAvatarDragActive(true);
  };

  const handleDragLeave = () => setAvatarDragActive(false);

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    localStorage.removeItem('userAvatarUrl');
    showToast('Profile photo removed.', 'info');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account & System Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage your profile photo, security, password updates, role permissions & system configuration</p>
      </div>

      {/* User Profile Banner */}
      <Card className="p-6 bg-gradient-to-r from-blue-900/20 via-indigo-900/10 to-transparent border-blue-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar Upload Area */}
          <div className="relative group shrink-0">
            <div
              className={`w-20 h-20 rounded-2xl overflow-hidden cursor-pointer ring-2 transition-all ${
                avatarDragActive
                  ? 'ring-blue-400 scale-105'
                  : 'ring-blue-500/30 hover:ring-blue-400/70'
              } shadow-lg shadow-blue-500/20`}
              onClick={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              title="Click or drag an image to upload"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-3xl select-none">
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </div>
              )}

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl">
                {isUploadingAvatar ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </div>
            </div>

            {/* Remove button */}
            {avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-600 hover:bg-rose-500 text-white rounded-full flex items-center justify-center shadow-md transition-all"
                title="Remove photo"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* User Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{user?.name}</h3>
              <Badge variant="info">{user?.role}</Badge>
            </div>
            <p className="text-xs text-slate-400 mt-1">{user?.email}</p>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              Active System Session | Logged in via JWT Guard
            </p>

            {/* Upload action hint */}
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/25 text-blue-400 text-[11px] font-bold transition-all"
              >
                <Upload className="w-3.5 h-3.5" />
                Upload Photo
              </button>
              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600/10 hover:bg-rose-600/20 border border-rose-500/25 text-rose-400 text-[11px] font-bold transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Remove
                </button>
              )}
              <span className="text-[10px] text-slate-500">JPG, PNG, GIF, WEBP · Max 5 MB</span>
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-2 text-right shrink-0">
            <span className="px-3 py-1 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-400 font-mono">
              ID: {user?.id || 'USR-SYSTEM'}
            </span>
          </div>
        </div>

        {/* Drag & Drop Zone Hint (shown when dragging) */}
        {avatarDragActive && (
          <div className="mt-3 py-2 rounded-xl border border-dashed border-blue-400/60 bg-blue-500/5 text-center text-xs text-blue-400 font-medium">
            Drop image here to upload as profile photo
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Security & Password Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3.5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Change Security Password</h3>
                  <p className="text-xs text-slate-400">Update your access credentials for this enterprise account</p>
                </div>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4 pt-1">
              <Input
                label="Current Account Password"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                icon={Lock}
              />
              <Input
                label="New Account Password"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 8 characters with at least one number"
                icon={Key}
              />

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500">
                  🔒 Encrypted using Bcrypt salt hashing
                </span>
                <Button type="submit" isLoading={isUpdating}>Update Password</Button>
              </div>
            </form>
          </Card>

          {/* Regional & System Preferences */}
          <Card className="space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-200 dark:border-slate-800/80 pb-3.5">
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Regional & Tax Controls</h3>
                <p className="text-xs text-slate-400">Default currency, timezone & GST calculation settings</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07090E] border border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Primary Currency</span>
                <p className="font-bold text-slate-200 text-sm">INR (₹ - Indian Rupee)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07090E] border border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Default GST Rate</span>
                <p className="font-bold text-slate-200 text-sm">18.00% Standard Tax</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07090E] border border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Timezone Specification</span>
                <p className="font-bold text-slate-200 text-sm">Asia/Kolkata (IST +5:30)</p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#07090E] border border-slate-200 dark:border-slate-800/80 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500">Audit Logging</span>
                <p className="font-bold text-emerald-400 text-sm">FULL_VERBOSITY</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar System Architecture Info */}
        <div className="space-y-6">
          <Card className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <Cpu className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">System Specs</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Database className="w-3.5 h-3.5 text-blue-400" /> Database</span>
                <span className="font-bold text-slate-200">PostgreSQL 16</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Server className="w-3.5 h-3.5 text-indigo-400" /> Backend API</span>
                <span className="font-bold text-slate-200">Express / Node</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Security Token</span>
                <span className="font-bold text-slate-200">JWT Dual Refresh</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-amber-400" /> API Server Status</span>
                <span className="font-bold text-emerald-400">Port 5000 Ready</span>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-600/10 border-blue-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-blue-400 font-bold">
              <CheckCircle2 className="w-4 h-4" /> Role Permissions
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              You are signed in as <strong className="text-white">{user?.role}</strong>. You have permission to access user management, audit logs, and master system settings.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};
