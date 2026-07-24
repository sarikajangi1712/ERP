import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Download, Eye, Trash2, Building, Mail, Phone } from 'lucide-react';
import { customerApi } from '../api/customerApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Table } from '../components/common/Table';
import { Badge } from '../components/common/Badge';
import { Pagination } from '../components/common/Pagination';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const Customers = () => {
  const [search, setSearch] = useState('');
  const [leadStatus, setLeadStatus] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  // Form State
  const [formData, setFormData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    leadStatus: 'PROSPECT',
    creditLimit: '100000',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['customers', search, leadStatus, page],
    queryFn: async () => {
      const res = await customerApi.getCustomers({ search, leadStatus, page, limit: 10 });
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newCustomer) => customerApi.createCustomer(newCustomer),
    onSuccess: () => {
      showToast('Customer created successfully!', 'success');
      queryClient.invalidateQueries(['customers']);
      setIsModalOpen(false);
      setFormData({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
        gstNumber: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        leadStatus: 'PROSPECT',
        creditLimit: '100000',
      });
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to create customer', 'error');
    },
  });

  const handleExportCSV = async () => {
    try {
      const res = await customerApi.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'customers-directory.csv');
      document.body.appendChild(link);
      link.click();
      showToast('Exported customers directory to CSV', 'info');
    } catch (err) {
      showToast('Export failed', 'error');
    }
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const customers = data?.data || [];
  const pagination = data?.pagination || {};

  const headers = [
    { title: 'Company Name' },
    { title: 'Contact Person' },
    { title: 'GSTIN / Contact' },
    { title: 'Lead Status' },
    { title: 'City / State' },
    { title: 'Actions', className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">Customer CRM Directory</h1>
          <p className="text-xs text-slate-500 mt-1">Manage wholesale buyers, lead stages, credit limits & accounts</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportCSV} icon={Download} className="flex-1 sm:flex-initial">Export CSV</Button>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={Plus} className="flex-1 sm:flex-initial">Add Customer</Button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company, contact person, GSTIN, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={leadStatus}
          onChange={(e) => { setLeadStatus(e.target.value); setPage(1); }}
          className="w-full sm:w-48 bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Lead Statuses</option>
          <option value="PROSPECT">Prospect</option>
          <option value="LEAD">Lead</option>
          <option value="ACTIVE">Active Customer</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </Card>

      {/* Table Data */}
      {isLoading ? (
        <Card><Skeleton className="h-64" /></Card>
      ) : customers.length === 0 ? (
        <EmptyState title="No customers found" message="Try searching for a different keyword or create a new customer record." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={headers}>
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5 font-bold text-slate-900 dark:text-slate-100">{c.companyName}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{c.contactPerson}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500 font-mono">{c.gstNumber || c.phone}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={c.leadStatus === 'ACTIVE' ? 'success' : c.leadStatus === 'LEAD' ? 'info' : 'warning'}>
                    {c.leadStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{c.city}, {c.state}</td>
                <td className="px-4 py-3.5 text-right">
                  <Link to={`/customers/${c.id}`}>
                    <Button variant="ghost" size="sm" icon={Eye}>View Profile</Button>
                  </Link>
                </td>
              </tr>
            ))}
          </Table>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Pagination currentPage={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
          </div>
        </Card>
      )}

      {/* Create Customer Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Customer">
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Company Name" required value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
            <Input label="Contact Person" required value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
            <Input label="Email Address" type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            <Input label="Phone Number" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            <Input label="GSTIN Number" value={formData.gstNumber} onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })} />
            <Input label="Credit Limit (₹)" type="number" value={formData.creditLimit} onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })} />
          </div>
          <Input label="Billing Address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input label="City" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            <Input label="State" required value={formData.state} onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
            <Input label="Pincode" required value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Save Customer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
