import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, Package, Warehouse, IndianRupee, FileText, AlertTriangle, TrendingUp, Clock } from 'lucide-react';
import { dashboardApi } from '../api/dashboardApi';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Skeleton } from '../components/common/Skeleton';
import { SalesTrendChart } from '../components/charts/SalesTrendChart';

export const Dashboard = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await dashboardApi.getStats();
      return res.data;
    },
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Enterprise Dashboard</h1>
        <p className="text-xs text-slate-500 mt-1">Real-time Operations, Revenue Metrics & Inventory Status</p>
      </div>



      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            {/* Card 1 — Total Customers */}
            <Card className="relative overflow-hidden p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Total Customers</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 leading-none">{stats.totalCustomers ?? '—'}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4 flex items-center gap-1.5">
                <Users className="w-3 h-3 text-blue-400" /> Active CRM accounts
              </p>
            </Card>

            {/* Card 2 — Product SKUs */}
            <Card className="relative overflow-hidden p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Product SKUs</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 leading-none">{stats.totalProducts ?? '—'}</h3>
                </div>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 shrink-0">
                  <Package className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4">
                {stats.lowStockCount ?? 0} items low in stock
              </p>
            </Card>

            {/* Card 3 — Inventory Value */}
            <Card className="relative overflow-hidden p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Inventory Value</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 leading-none">
                    ₹{Number(stats.inventoryValue || 0).toLocaleString('en-IN')}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Warehouse className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-emerald-500 mt-4">Across all warehouses</p>
            </Card>

            {/* Card 4 — Revenue */}
            <Card className="relative overflow-hidden p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-tight">Revenue Realized</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100 mt-2 leading-none">
                    ₹{Number(stats.totalRevenue || 0).toLocaleString('en-IN')}
                  </h3>
                </div>
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                  <IndianRupee className="w-5 h-5" />
                </div>
              </div>
              <p className="text-[11px] text-slate-400 mt-4">
                {stats.unpaidInvoicesCount || 0} unpaid invoices pending
              </p>
            </Card>
          </>
        )}
      </div>

      {/* Analytics Chart & Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Monthly Sales Volume Trend</h3>
              <p className="text-xs text-slate-400">Confirmed sales challan values over time</p>
            </div>
            <Badge variant="info">Confirmed Sales</Badge>
          </div>
          {isLoading ? <Skeleton className="h-64" /> : <SalesTrendChart data={charts.monthlySales} />}
        </Card>

        {/* Audit Trail Activity Timeline */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" /> Recent Operations Log
            </h3>
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-12" />)
            ) : recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400">No activity recorded yet.</p>
            ) : (
              recentActivity.map((log) => (
                <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs border border-slate-200/50 dark:border-slate-800/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{log.action}</span>
                    <span className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <p className="text-slate-500 truncate">{log.details}</p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};
