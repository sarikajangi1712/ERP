import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Warehouse, ArrowUpRight, ArrowDownLeft, ArrowRightLeft, History, AlertTriangle, Search } from 'lucide-react';
import { inventoryApi } from '../api/inventoryApi';
import { productApi } from '../api/productApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Badge } from '../components/common/Badge';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const Inventory = () => {
  const [selectedWarehouseId, setSelectedWarehouseId] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('stock'); // 'stock' | 'movements'
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  // Stock Adjustment Form State
  const [adjustForm, setAdjustForm] = useState({
    productId: '',
    warehouseId: '',
    quantity: '10',
    type: 'STOCK_IN',
    remarks: 'Routine shipment intake',
  });

  // Stock Transfer Form State
  const [transferForm, setTransferForm] = useState({
    productId: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    quantity: '5',
    remarks: 'Inter-warehouse stock rebalancing',
  });

  const { data: stockData, isLoading: isStockLoading } = useQuery({
    queryKey: ['inventoryStock', selectedWarehouseId, search],
    queryFn: async () => {
      const res = await inventoryApi.getStockLevels({ warehouseId: selectedWarehouseId, search });
      return res.data.inventories;
    },
  });

  const { data: warehouseData } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => {
      const res = await inventoryApi.getWarehouses();
      return res.data.warehouses;
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['allProducts'],
    queryFn: async () => {
      const res = await productApi.getProducts({ limit: 100 });
      return res.data.data;
    },
  });

  const { data: movementsData } = useQuery({
    queryKey: ['stockMovements'],
    queryFn: async () => {
      const res = await inventoryApi.getMovements();
      return res.data.movements;
    },
    enabled: activeTab === 'movements',
  });

  const adjustMutation = useMutation({
    mutationFn: (data) => inventoryApi.adjustStock(data),
    onSuccess: () => {
      showToast('Stock balance updated successfully', 'success');
      queryClient.invalidateQueries(['inventoryStock']);
      setIsAdjustModalOpen(false);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Stock adjustment failed', 'error');
    },
  });

  const transferMutation = useMutation({
    mutationFn: (data) => inventoryApi.transferStock(data),
    onSuccess: () => {
      showToast('Inter-warehouse transfer completed', 'success');
      queryClient.invalidateQueries(['inventoryStock']);
      setIsTransferModalOpen(false);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Stock transfer failed', 'error');
    },
  });

  const handleAdjustSubmit = (e) => {
    e.preventDefault();
    adjustMutation.mutate(adjustForm);
  };

  const handleTransferSubmit = (e) => {
    e.preventDefault();
    transferMutation.mutate(transferForm);
  };

  const warehouses = warehouseData || [];
  const inventories = stockData || [];
  const products = productsData || [];
  const movements = movementsData || [];

  const stockHeaders = [
    { title: 'Product / SKU' },
    { title: 'Warehouse Depot' },
    { title: 'Current Quantity' },
    { title: 'Min Threshold' },
    { title: 'Last Updated' },
  ];

  const movementHeaders = [
    { title: 'Timestamp' },
    { title: 'Product SKU' },
    { title: 'Movement Type' },
    { title: 'Qty' },
    { title: 'Source / Destination' },
    { title: 'Remarks' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Warehouse Inventory Control</h1>
          <p className="text-xs text-slate-500 mt-1">Multi-depot stock management, audit trails & inter-warehouse transfers</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsTransferModalOpen(true)} icon={ArrowRightLeft}>Transfer Stock</Button>
          <Button variant="primary" onClick={() => setIsAdjustModalOpen(true)} icon={ArrowUpRight}>Adjust Stock</Button>
        </div>
      </div>

      {/* Warehouses Bar & Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedWarehouseId('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedWarehouseId === '' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            All Depots
          </button>
          {warehouses.map((w) => (
            <button
              key={w.id}
              onClick={() => setSelectedWarehouseId(w.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedWarehouseId === w.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              {w.name} ({w.code})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-800 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveTab('stock')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${activeTab === 'stock' ? 'bg-white dark:bg-[#0B0F19] text-blue-500 shadow-sm' : 'text-slate-400'}`}
          >
            Stock Levels
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${activeTab === 'movements' ? 'bg-white dark:bg-[#0B0F19] text-blue-500 shadow-sm' : 'text-slate-400'}`}
          >
            Movement Audit
          </button>
        </div>
      </div>

      {activeTab === 'stock' ? (
        <>
          {/* Search */}
          <Card className="p-4">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search stock by SKU, product name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </Card>

          {isStockLoading ? (
            <Card><Skeleton className="h-64" /></Card>
          ) : inventories.length === 0 ? (
            <EmptyState title="No inventory balances" message="No stock balances found matching the filter." />
          ) : (
            <Card className="p-0 overflow-hidden">
              <Table headers={stockHeaders}>
                {inventories.map((inv) => {
                  const isLow = inv.quantity <= inv.product.minStockAlert;
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 dark:text-slate-100 block">{inv.product.name}</span>
                        <span className="text-[10px] text-blue-500 font-mono font-semibold">{inv.product.sku}</span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{inv.warehouse.name}</td>
                      <td className="px-4 py-3.5">
                        <span className={`text-sm font-bold ${isLow ? 'text-rose-500' : 'text-slate-900 dark:text-slate-100'}`}>
                          {inv.quantity} Units
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-slate-500">{inv.product.minStockAlert} Units</td>
                      <td className="px-4 py-3.5 text-xs text-slate-400">{new Date(inv.updatedAt).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </Table>
            </Card>
          )}
        </>
      ) : (
        /* Movements Audit Table */
        <Card className="p-0 overflow-hidden">
          <Table headers={movementHeaders}>
            {movements.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5 text-xs text-slate-400">{new Date(m.createdAt).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-xs font-mono font-bold text-blue-500">{m.product?.sku}</td>
                <td className="px-4 py-3.5">
                  <Badge variant={m.type.includes('IN') || m.type.includes('RESTORE') ? 'success' : 'danger'}>
                    {m.type}
                  </Badge>
                </td>
                <td className="px-4 py-3.5 text-xs font-bold">{m.quantity}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">
                  {m.fromWarehouse ? m.fromWarehouse.code : 'EXT'} → {m.toWarehouse ? m.toWarehouse.code : 'EXT'}
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-400 max-w-xs truncate">{m.remarks}</td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Stock Adjustment Modal */}
      <Modal isOpen={isAdjustModalOpen} onClose={() => setIsAdjustModalOpen(false)} title="Stock Intake / Write-off Adjustment">
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Select Product SKU</label>
            <select
              required
              value={adjustForm.productId}
              onChange={(e) => setAdjustForm({ ...adjustForm, productId: e.target.value })}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Product SKU</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Warehouse Depot</label>
            <select
              required
              value={adjustForm.warehouseId}
              onChange={(e) => setAdjustForm({ ...adjustForm, warehouseId: e.target.value })}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase">Adjustment Type</label>
              <select
                value={adjustForm.type}
                onChange={(e) => setAdjustForm({ ...adjustForm, type: e.target.value })}
                className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="STOCK_IN">Stock In (+)</option>
                <option value="STOCK_OUT">Stock Out (-)</option>
              </select>
            </div>
            <Input label="Quantity Units" type="number" required value={adjustForm.quantity} onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })} />
          </div>

          <Input label="Remarks / Reason" value={adjustForm.remarks} onChange={(e) => setAdjustForm({ ...adjustForm, remarks: e.target.value })} />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsAdjustModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={adjustMutation.isPending}>Submit Adjustment</Button>
          </div>
        </form>
      </Modal>

      {/* Stock Transfer Modal */}
      <Modal isOpen={isTransferModalOpen} onClose={() => setIsTransferModalOpen(false)} title="Inter-Warehouse Stock Transfer">
        <form onSubmit={handleTransferSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Select Product SKU</label>
            <select
              required
              value={transferForm.productId}
              onChange={(e) => setTransferForm({ ...transferForm, productId: e.target.value })}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Product SKU</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>{p.sku} - {p.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase">From Source Warehouse</label>
              <select
                required
                value={transferForm.fromWarehouseId}
                onChange={(e) => setTransferForm({ ...transferForm, fromWarehouseId: e.target.value })}
                className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="">Source Warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase">To Destination Warehouse</label>
              <select
                required
                value={transferForm.toWarehouseId}
                onChange={(e) => setTransferForm({ ...transferForm, toWarehouseId: e.target.value })}
                className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
              >
                <option value="">Destination Warehouse</option>
                {warehouses.map((w) => (
                  <option key={w.id} value={w.id}>{w.name}</option>
                ))}
              </select>
            </div>
          </div>

          <Input label="Transfer Quantity" type="number" required value={transferForm.quantity} onChange={(e) => setTransferForm({ ...transferForm, quantity: e.target.value })} />
          <Input label="Remarks" value={transferForm.remarks} onChange={(e) => setTransferForm({ ...transferForm, remarks: e.target.value })} />

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsTransferModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={transferMutation.isPending}>Execute Stock Transfer</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
