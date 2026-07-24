import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, CheckCircle2, XCircle, FileText, Eye, Receipt } from 'lucide-react';
import { challanApi } from '../api/challanApi';
import { invoiceApi } from '../api/invoiceApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const SalesChallans = () => {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const { data, isLoading } = useQuery({
    queryKey: ['salesChallans', status, search, page],
    queryFn: async () => {
      const res = await challanApi.getChallans({ status, search, page });
      return res.data;
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (id) => challanApi.confirmChallan(id),
    onSuccess: (res) => {
      showToast('Sales Challan confirmed & inventory stock locked!', 'success');
      queryClient.invalidateQueries(['salesChallans']);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to confirm challan', 'error');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => challanApi.cancelChallan(id),
    onSuccess: () => {
      showToast('Sales Challan cancelled & stock restored to warehouse', 'info');
      queryClient.invalidateQueries(['salesChallans']);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to cancel challan', 'error');
    },
  });

  const generateInvoiceMutation = useMutation({
    mutationFn: (challanId) => invoiceApi.generateFromChallan(challanId),
    onSuccess: (res) => {
      showToast(`Tax Invoice #${res.data.invoice.invoiceNumber} generated!`, 'success');
      queryClient.invalidateQueries(['salesChallans']);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Invoice generation failed', 'error');
    },
  });

  const challans = data?.data || [];
  const pagination = data?.pagination || {};

  const headers = [
    { title: 'Challan Number' },
    { title: 'Customer' },
    { title: 'Warehouse' },
    { title: 'Grand Total' },
    { title: 'Status' },
    { title: 'Invoice Ref' },
    { title: 'Actions', className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Create */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Challans Operations</h1>
          <p className="text-xs text-slate-500 mt-1">Issue dispatch challans, lock stock allocations, generate tax invoices</p>
        </div>
        <Link to="/challans/new">
          <Button variant="primary" icon={Plus}>Create Sales Challan</Button>
        </Link>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Challan number, Customer company..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['', 'DRAFT', 'CONFIRMED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => { setStatus(st); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                status === st ? 'bg-white dark:bg-[#0B0F19] text-blue-500 shadow-sm' : 'text-slate-400'
              }`}
            >
              {st === '' ? 'All Challans' : st}
            </button>
          ))}
        </div>
      </Card>

      {/* Listing */}
      {isLoading ? (
        <Card><Skeleton className="h-64" /></Card>
      ) : challans.length === 0 ? (
        <EmptyState title="No sales challans" message="No sales challans match your query criteria." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={headers}>
            {challans.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5 font-bold font-mono text-blue-500">{c.challanNumber}</td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-slate-100">{c.customer.companyName}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{c.warehouse.code}</td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                  ₹{Number(c.grandTotal).toLocaleString()}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={c.status === 'CONFIRMED' ? 'success' : c.status === 'CANCELLED' ? 'danger' : 'warning'}>
                    {c.status}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-xs">
                  {c.invoice ? (
                    <span className="text-emerald-500 font-bold font-mono">{c.invoice.invoiceNumber}</span>
                  ) : (
                    <span className="text-slate-400">None</span>
                  )}
                </td>
                <td className="px-4 py-3.5 text-right space-x-1">
                  {c.status === 'DRAFT' && (
                    <Button
                      size="sm"
                      variant="success"
                      icon={CheckCircle2}
                      isLoading={confirmMutation.isPending}
                      onClick={() => confirmMutation.mutate(c.id)}
                    >
                      Confirm
                    </Button>
                  )}
                  {c.status === 'CONFIRMED' && !c.invoice && (
                    <Button
                      size="sm"
                      variant="primary"
                      icon={Receipt}
                      isLoading={generateInvoiceMutation.isPending}
                      onClick={() => generateInvoiceMutation.mutate(c.id)}
                    >
                      Generate Invoice
                    </Button>
                  )}
                  {c.status !== 'CANCELLED' && (
                    <Button
                      size="sm"
                      variant="danger"
                      icon={XCircle}
                      isLoading={cancelMutation.isPending}
                      onClick={() => cancelMutation.mutate(c.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </Table>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Pagination currentPage={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
          </div>
        </Card>
      )}
    </div>
  );
};
