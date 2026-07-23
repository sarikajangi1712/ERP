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

      {/* Low Stock Warning Alert Banner */}
      {stats.lowStockCount > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div>
              <p className="text-sm font-bold text-amber-500">Low Inventory Threshold Alert</p>
              <p className="text-xs text-slate-400">
                {stats.lowStockCount} product SKUs have stock levels at or below safety reorder threshold.
              </p>
            </div>
          </div>
          <Badge variant="warning" className="shrink-0">{stats.lowStockCount} Action Needed</Badge>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Active Customers</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.totalCustomers}</h3>
                </div>
                <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-emerald-500 mt-4 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
              </p>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Product Master SKUs</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{stats.totalProducts}</h3>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                  <Package className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">{stats.lowStockCount} items low in stock</p>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inventory Asset Valuation</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    ₹{Number(stats.inventoryValue || 0).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500">
                  <Warehouse className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-emerald-500 mt-4">Across all warehouses</p>
            </Card>

            <Card className="relative overflow-hidden">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue Realized</p>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    ₹{Number(stats.totalRevenue || 0).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                  <IndianRupee className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-4">{stats.unpaidInvoicesCount || 0} unpaid invoices pending</p>
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
