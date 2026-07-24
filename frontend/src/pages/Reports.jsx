import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, BarChart3, TrendingUp, Warehouse, Percent } from 'lucide-react';
import { reportApi } from '../api/reportApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Table } from '../components/common/Table';
import { Skeleton } from '../components/common/Skeleton';

export const Reports = () => {
  const [activeTab, setActiveTab] = useState('sales'); // 'sales' | 'inventory' | 'gst'
  const { showToast } = useNotification();

  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: ['salesReport'],
    queryFn: async () => {
      const res = await reportApi.getSalesReport();
      return res.data.sales;
    },
    enabled: activeTab === 'sales',
  });

  const { data: invData, isLoading: isInvLoading } = useQuery({
    queryKey: ['inventoryReport'],
    queryFn: async () => {
      const res = await reportApi.getInventoryReport();
      return res.data.report;
    },
    enabled: activeTab === 'inventory',
  });

  const { data: gstData, isLoading: isGstLoading } = useQuery({
    queryKey: ['gstReport'],
    queryFn: async () => {
      const res = await reportApi.getGSTReport();
      return res.data;
    },
    enabled: activeTab === 'gst',
  });

  const handleSalesCsvExport = async () => {
    try {
      const res = await reportApi.getSalesReport({ exportCsv: 'true' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'sales-performance-report.csv');
      document.body.appendChild(link);
      link.click();
      showToast('Exported Sales Performance Report to CSV', 'info');
    } catch (err) {
      showToast('CSV export failed', 'error');
    }
  };

  const salesList = salesData || [];
  const inventoryList = invData || [];
  const gstSummary = gstData?.summary || {};
  const gstInvoices = gstData?.invoices || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Enterprise Reports & Analytics</h1>
          <p className="text-xs text-slate-500 mt-1">Audit-ready financial statements, stock valuation & GST tax summaries</p>
        </div>
        {activeTab === 'sales' && (
          <Button variant="outline" icon={Download} onClick={handleSalesCsvExport}>Export Sales CSV</Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'sales' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30' : 'bg-slate-100 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Sales Report
        </button>
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'inventory' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30' : 'bg-slate-100 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
          }`}
        >
          <Warehouse className="w-4 h-4" /> Stock Valuation
        </button>
        <button
          onClick={() => setActiveTab('gst')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'gst' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-500/30' : 'bg-slate-100 dark:bg-[#0E131F] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
          }`}
        >
          <Percent className="w-4 h-4" /> GST Tax Filing
        </button>
      </div>

      {activeTab === 'sales' && (
        isSalesLoading ? <Card><Skeleton className="h-64" /></Card> : (
          <Card className="p-0 overflow-hidden">
            <Table headers={[{ title: 'Challan #' }, { title: 'Date' }, { title: 'Customer' }, { title: 'Subtotal' }, { title: 'Tax (GST)' }, { title: 'Grand Total' }]}>
              {salesList.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-blue-500">{s.challanNumber}</td>
                  <td className="px-4 py-3 text-xs text-slate-400">{new Date(s.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-slate-100">{s.customer?.companyName}</td>
                  <td className="px-4 py-3 text-xs">₹{Number(s.subTotal).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">₹{Number(s.taxAmount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-500">₹{Number(s.grandTotal).toLocaleString()}</td>
                </tr>
              ))}
            </Table>
          </Card>
        )
      )}

      {activeTab === 'inventory' && (
        isInvLoading ? <Card><Skeleton className="h-64" /></Card> : (
          <Card className="p-0 overflow-hidden">
            <Table headers={[{ title: 'Product SKU' }, { title: 'Category' }, { title: 'Unit Purchase Price' }, { title: 'Total Stock Qty' }, { title: 'Total Asset Valuation' }]}>
              {inventoryList.map((i) => (
                <tr key={i.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="px-4 py-3 font-mono font-bold text-blue-500">{i.sku} - {i.name}</td>
                  <td className="px-4 py-3 text-xs text-slate-500">{i.category}</td>
                  <td className="px-4 py-3 text-xs">₹{Number(i.unitPrice).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs font-bold">{i.totalQty} Units</td>
                  <td className="px-4 py-3 text-xs font-bold text-emerald-500">₹{Number(i.totalValuation).toLocaleString()}</td>
                </tr>
              ))}
            </Table>
          </Card>
        )
      )}

      {activeTab === 'gst' && (
        isGstLoading ? <Card><Skeleton className="h-64" /></Card> : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Invoiced Subtotal</span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-1">₹{Number(gstSummary.totalSubtotal || 0).toLocaleString()}</h3>
              </Card>
              <Card>
                <span className="text-xs text-slate-400 font-semibold uppercase">Total GST Output Tax Collected</span>
                <h3 className="text-xl font-bold text-emerald-500 mt-1">₹{Number(gstSummary.totalGST || 0).toLocaleString()}</h3>
              </Card>
              <Card>
                <span className="text-xs text-slate-400 font-semibold uppercase">Total Invoiced Output</span>
                <h3 className="text-xl font-bold text-blue-500 mt-1">₹{Number(gstSummary.totalGrand || 0).toLocaleString()}</h3>
              </Card>
            </div>

            <Card className="p-0 overflow-hidden">
              <Table headers={[{ title: 'Invoice #' }, { title: 'GSTIN' }, { title: 'Taxable Amount' }, { title: 'Output GST Tax' }, { title: 'Grand Total' }]}>
                {gstInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-500">{inv.invoiceNumber}</td>
                    <td className="px-4 py-3 text-xs font-mono">{inv.customer?.gstNumber || 'N/A'}</td>
                    <td className="px-4 py-3 text-xs">₹{Number(inv.subTotal).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-bold text-emerald-500">₹{Number(inv.taxAmount).toLocaleString()}</td>
                    <td className="px-4 py-3 text-xs font-bold text-slate-900 dark:text-slate-100">₹{Number(inv.grandTotal).toLocaleString()}</td>
                  </tr>
                ))}
              </Table>
            </Card>
          </div>
        )
      )}
    </div>
  );
};
