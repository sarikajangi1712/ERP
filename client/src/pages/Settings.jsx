import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, User, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useNotification();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

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

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Account Settings</h1>
        <p className="text-xs text-slate-500 mt-1">Manage account security, password updates & role permissions</p>
      </div>

      {/* User Info Card */}
      <Card className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-600/10 text-blue-500 flex items-center justify-center font-bold text-2xl">
          {user?.name ? user.name[0] : 'U'}
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{user?.name}</h3>
          <p className="text-xs text-slate-500">{user?.email}</p>
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-2">
            Role: {user?.role}
          </span>
        </div>
      </Card>

      {/* Change Password Card */}
      <Card className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <Key className="w-5 h-5 text-blue-500" />
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Change Account Password</h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            required
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Min 8 characters with at least one number"
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" isLoading={isUpdating}>Update Password</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
