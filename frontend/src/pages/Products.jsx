import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Package, Grid, List, Tag, AlertTriangle, Image as ImageIcon } from 'lucide-react';
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

export const Products = () => {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useNotification();

  const [formData, setFormData] = useState({
    sku: '',
    barcode: '',
    name: '',
    description: '',
    categoryId: '',
    purchasePrice: '',
    sellingPrice: '',
    gstRate: '18',
    minStockAlert: '10',
  });
  const [imageFile, setImageFile] = useState(null);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', search, categoryId],
    queryFn: async () => {
      const res = await productApi.getProducts({ search, categoryId });
      return res.data;
    },
  });

  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res = await productApi.getCategories();
      return res.data.categories;
    },
  });

  const createMutation = useMutation({
    mutationFn: (data) => productApi.createProduct(data),
    onSuccess: () => {
      showToast('Product SKU created successfully!', 'success');
      queryClient.invalidateQueries(['products']);
      setIsModalOpen(false);
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to create product SKU', 'error');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = new FormData();
    Object.keys(formData).forEach((k) => payload.append(k, formData[k]));
    if (imageFile) payload.append('image', imageFile);

    createMutation.mutate(payload);
  };

  const products = productsData?.data || [];
  const categories = catData || [];

  const tableHeaders = [
    { title: 'Product / SKU' },
    { title: 'Category' },
    { title: 'Purchase Price' },
    { title: 'Selling Price' },
    { title: 'Stock Level' },
    { title: 'Stock Status' },
  ];

  return (
    <div className="space-y-6">
      {/* Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Product Master Catalog</h1>
          <p className="text-xs text-slate-500 mt-1">Manage product SKUs, pricing, GST tax rates & barcode data</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-[#0B0F19] text-blue-500 shadow-sm' : 'text-slate-400'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'table' ? 'bg-white dark:bg-[#0B0F19] text-blue-500 shadow-sm' : 'text-slate-400'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
          <Button variant="primary" onClick={() => setIsModalOpen(true)} icon={Plus}>Add Product SKU</Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by SKU, Barcode, Product Name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full sm:w-48 bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </Card>

      {/* Catalog Listing */}
      {isLoading ? (
        <Card><Skeleton className="h-64" /></Card>
      ) : products.length === 0 ? (
        <EmptyState title="No products found" message="No product SKUs match your current search query." />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <Card key={p.id} className="flex flex-col justify-between overflow-hidden group">
              <div>
                <div className="h-40 bg-slate-100 dark:bg-slate-800/60 rounded-xl mb-3 overflow-hidden relative">
                  {p.imageUrl ? (
                    <img 
                      src={p.imageUrl} 
                      alt={p.name} 
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60';
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-8 h-8" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge variant={p.stockStatus === 'IN_STOCK' ? 'success' : p.stockStatus === 'LOW_STOCK' ? 'warning' : 'danger'}>
                      {p.stockStatus}
                    </Badge>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-blue-500">{p.sku}</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{p.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
              </div>

              <div className="pt-4 mt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Selling Price (+{p.gstRate}% GST)</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">₹{Number(p.sellingPrice).toLocaleString()}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">Total Stock</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{p.totalStock} Units</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-0 overflow-hidden">
          <Table headers={tableHeaders}>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3.5">
                  <span className="font-bold text-slate-900 dark:text-slate-100 block">{p.name}</span>
                  <span className="text-[10px] text-blue-500 font-mono font-semibold">{p.sku} | Barcode: {p.barcode}</span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{p.category?.name}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">₹{Number(p.purchasePrice).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-xs font-bold text-slate-900 dark:text-slate-100">₹{Number(p.sellingPrice).toLocaleString()}</td>
                <td className="px-4 py-3.5 text-xs font-bold">{p.totalStock} Units</td>
                <td className="px-4 py-3.5">
                  <Badge variant={p.stockStatus === 'IN_STOCK' ? 'success' : p.stockStatus === 'LOW_STOCK' ? 'warning' : 'danger'}>
                    {p.stockStatus}
                  </Badge>
                </td>
              </tr>
            ))}
          </Table>
        </Card>
      )}

      {/* Create Product Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Product SKU">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Product SKU Code" required value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} placeholder="e.g. SKU-ELEC-103" />
            <Input label="Barcode Number" required value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} placeholder="e.g. 8901234567894" />
          </div>
          <Input label="Product Name" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Category</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input label="Purchase Price (₹)" type="number" required value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} />
            <Input label="Selling Price (₹)" type="number" required value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })} />
            <Input label="GST Tax Rate (%)" type="number" value={formData.gstRate} onChange={(e) => setFormData({ ...formData, gstRate: e.target.value })} />
            <Input label="Min Stock Alert Threshold" type="number" value={formData.minStockAlert} onChange={(e) => setFormData({ ...formData, minStockAlert: e.target.value })} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Product Image Upload</label>
            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="text-xs text-slate-400" />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Save Product SKU</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
