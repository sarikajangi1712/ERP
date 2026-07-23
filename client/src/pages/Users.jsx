import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, UserCheck, UserX, Shield, Mail, Phone, Lock } from 'lucide-react';
import { userApi } from '../api/userApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const Users = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'SALES',
    phone: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['usersList'],
    queryFn: async () => {
      const res = await userApi.getUsers();
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newUser) => userApi.createUser(newUser),
    onSuccess: () => {
      showToast('New user account created successfully!', 'success');
      queryClient.invalidateQueries(['usersList']);
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'SALES',
        phone: '',
      });
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to create user account', 'error');
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (id) => userApi.toggleUserStatus(id),
    onSuccess: (res) => {
      showToast(res.data.message || 'User status updated', 'success');
      queryClient.invalidateQueries(['usersList']);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to update user status', 'error');
    },
  });

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      showToast('Please fill in all required fields', 'error');
      return;
    }
    createMutation.mutate(formData);
  };

  const users = data?.data || [];

  const headers = [
    { title: 'User Name & Email' },
    { title: 'Role' },
    { title: 'Phone Number' },
    { title: 'Account Status' },
    { title: 'Created Date' },
    { title: 'Actions', className: 'text-right' },
  ];

  const getRoleVariant = (role) => {
    switch (role) {
      case 'ADMIN': return 'danger';
      case 'SALES': return 'info';
      case 'WAREHOUSE': return 'warning';
      case 'ACCOUNTS': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">User Management</h1>
          <p className="text-xs text-slate-500 mt-1">Create user accounts, set role permissions (`ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`) and manage access.</p>
        </div>
        <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={Plus}>Add New User</Button>
      </div>

      {/* Users Table */}
      {isLoading ? (
        <Card><Skeleton className="h-64" /></Card>
      ) : users.length === 0 ? (
        <EmptyState title="No users found" message="Click 'Add New User' to create an account for a team member." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={headers}>
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5">
                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{u.name}</span>
                    <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400 inline" /> {u.email}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={getRoleVariant(u.role)}>
                    {u.role}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">
                  {u.phone || '—'}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={u.isActive ? 'success' : 'default'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-400 font-mono">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3.5 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStatusMutation.mutate(u.id)}
                    icon={u.isActive ? UserX : UserCheck}
                    className={u.isActive ? 'text-amber-600 hover:text-amber-700' : 'text-emerald-600 hover:text-emerald-700'}
                  >
                    {u.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Create User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Team User">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="e.g. John Doe"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <Input
            label="Email Address (Used for Login)"
            type="email"
            placeholder="e.g. john@company.com"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 6 characters"
            required
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <Input
            label="Phone Number (Optional)"
            placeholder="e.g. +91 98765 43210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Assigned Access Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="SALES">Sales Executive (Customers, CRM, Challans)</option>
              <option value="WAREHOUSE">Warehouse Manager (Products, Stock Adjustments)</option>
              <option value="ACCOUNTS">Accounts Lead (Invoices, Tax Reports)</option>
              <option value="ADMIN">System Admin (Full Access & Audit Logs)</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Create User Account</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
