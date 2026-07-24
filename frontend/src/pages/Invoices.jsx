import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Search, Download, FileText, CheckCircle2, DollarSign } from 'lucide-react';
import { invoiceApi } from '../api/invoiceApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { Pagination } from '../components/common/Pagination';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const Invoices = () => {
  const [paymentStatus, setPaymentStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('PAID');
  const [paidAmount, setPaidAmount] = useState('');

  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const { data, isLoading } = useQuery({
    queryKey: ['invoicesList', paymentStatus, search, page],
    queryFn: async () => {
      const res = await invoiceApi.getInvoices({ paymentStatus, search, page });
      return res.data;
    },
  });

  const paymentMutation = useMutation({
    mutationFn: ({ id, data }) => invoiceApi.updatePayment(id, data),
    onSuccess: () => {
      showToast('Invoice payment status updated', 'success');
      queryClient.invalidateQueries(['invoicesList']);
      setPaymentModalOpen(false);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Payment status update failed', 'error');
    },
  });

  const handleDownloadPDF = async (invoice) => {
    try {
      const res = await invoiceApi.downloadPDF(invoice.id);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Tax-Invoice-${invoice.invoiceNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      showToast(`Downloaded Invoice PDF #${invoice.invoiceNumber}`, 'info');
    } catch (err) {
      showToast('PDF download failed', 'error');
    }
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    paymentMutation.mutate({
      id: selectedInvoice.id,
      data: { paymentStatus: newStatus, paidAmount: Number(paidAmount) },
    });
  };

  const invoices = data?.data || [];
  const pagination = data?.pagination || {};

  const headers = [
    { title: 'Invoice Number' },
    { title: 'Customer Company' },
    { title: 'Grand Total' },
    { title: 'Paid Amount' },
    { title: 'Payment Status' },
    { title: 'Due Date' },
    { title: 'Actions', className: 'text-right' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tax Invoice Register</h1>
        <p className="text-xs text-slate-500 mt-1">Manage accounts receivable, track payment status, download PDF invoices</p>
      </div>

      {/* Filter Tabs & Search */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search invoice number, customer name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
          {['', 'PENDING', 'PARTIAL', 'PAID', 'OVERDUE'].map((st) => (
            <button
              key={st}
              onClick={() => { setPaymentStatus(st); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                paymentStatus === st ? 'bg-white dark:bg-[#0B0F19] text-blue-500 shadow-sm' : 'text-slate-400'
              }`}
            >
              {st === '' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </Card>

      {/* Table */}
      {isLoading ? (
        <Card><Skeleton className="h-64" /></Card>
      ) : invoices.length === 0 ? (
        <EmptyState title="No invoices found" message="No tax invoices match your filter criteria." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={headers}>
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5 font-bold font-mono text-emerald-500">{inv.invoiceNumber}</td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-slate-100">{inv.customer.companyName}</td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-slate-100">
                  ₹{Number(inv.grandTotal).toLocaleString()}
                </td>
                <td className="px-4 py-3.5 text-xs font-mono text-slate-500">
                  ₹{Number(inv.paidAmount).toLocaleString()}
                </td>
                <td className="px-4 py-3.5">
                  <Badge variant={inv.paymentStatus === 'PAID' ? 'success' : inv.paymentStatus === 'PARTIAL' ? 'warning' : 'danger'}>
                    {inv.paymentStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-400">{new Date(inv.dueDate).toLocaleDateString()}</td>
                <td className="px-4 py-3.5 text-right space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    icon={DollarSign}
                    onClick={() => {
                      setSelectedInvoice(inv);
                      setNewStatus(inv.paymentStatus);
                      setPaidAmount(inv.grandTotal);
                      setPaymentModalOpen(true);
                    }}
                  >
                    Update Payment
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Download}
                    onClick={() => handleDownloadPDF(inv)}
                  >
                    PDF
                  </Button>
                </td>
              </tr>
            ))}
          </Table>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <Pagination currentPage={page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
          </div>
        </Card>
      )}

      {/* Payment Status Modal */}
      <Modal isOpen={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} title="Update Invoice Payment Status">
        <form onSubmit={handlePaymentSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Payment Status</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="PAID">PAID</option>
              <option value="PARTIAL">PARTIAL</option>
              <option value="PENDING">PENDING</option>
              <option value="OVERDUE">OVERDUE</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Amount Received (₹)</label>
            <input
              type="number"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm font-mono text-slate-900 dark:text-slate-100"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setPaymentModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={paymentMutation.isPending}>Save Payment Status</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
