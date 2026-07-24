import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { ArrowLeft, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { challanApi } from '../api/challanApi';
import { customerApi } from '../api/customerApi';
import { productApi } from '../api/productApi';
import { inventoryApi } from '../api/inventoryApi';
import { useNotification } from '../context/NotificationContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const CreateChallan = () => {
  const [customerId, setCustomerId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [discountAmount, setDiscountAmount] = useState('0');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState([
    { productId: '', quantity: 1, unitPrice: 0, gstRate: 18, totalAmount: 0 },
  ]);

  const navigate = useNavigate();
  const { showToast } = useNotification();

  const { data: customersData } = useQuery({
    queryKey: ['allCustomers'],
    queryFn: async () => {
      const res = await customerApi.getCustomers({ limit: 100 });
      return res.data.data;
    },
  });

  const { data: warehouseData } = useQuery({
    queryKey: ['allWarehouses'],
    queryFn: async () => {
      const res = await inventoryApi.getWarehouses();
      return res.data.warehouses;
    },
  });

  const { data: productsData } = useQuery({
    queryKey: ['allProductsList'],
    queryFn: async () => {
      const res = await productApi.getProducts({ limit: 100 });
      return res.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (payload) => challanApi.createChallan(payload),
    onSuccess: (res) => {
      showToast(`Draft Sales Challan #${res.data.challan.challanNumber} created!`, 'success');
      navigate('/challans');
    },
    onError: (err) => {
      showToast(err.response?.data?.message || 'Failed to create sales challan', 'error');
    },
  });

  const handleProductChange = (index, productId) => {
    const selectedProd = (productsData || []).find((p) => p.id === productId);
    const newItems = [...items];
    if (selectedProd) {
      const unitPrice = Number(selectedProd.sellingPrice);
      const gstRate = Number(selectedProd.gstRate);
      const qty = newItems[index].quantity;
      const sub = unitPrice * qty;
      const tax = (sub * gstRate) / 100;
      newItems[index] = {
        productId,
        quantity: qty,
        unitPrice,
        gstRate,
        totalAmount: sub + tax,
      };
    } else {
      newItems[index].productId = '';
    }
    setItems(newItems);
  };

  const handleQuantityChange = (index, qty) => {
    const quantity = Math.max(1, parseInt(qty) || 1);
    const newItems = [...items];
    const item = newItems[index];
    const sub = item.unitPrice * quantity;
    const tax = (sub * item.gstRate) / 100;
    newItems[index] = {
      ...item,
      quantity,
      totalAmount: sub + tax,
    };
    setItems(newItems);
  };

  const addItemRow = () => {
    setItems([...items, { productId: '', quantity: 1, unitPrice: 0, gstRate: 18, totalAmount: 0 }]);
  };

  const removeItemRow = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Summary Totals
  const subTotal = items.reduce((acc, it) => acc + it.unitPrice * it.quantity, 0);
  const taxAmount = items.reduce((acc, it) => acc + ((it.unitPrice * it.quantity) * it.gstRate) / 100, 0);
  const grandTotal = subTotal + taxAmount - Number(discountAmount || 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerId || !warehouseId) {
      return showToast('Please select customer and target warehouse', 'error');
    }
    if (items.some((i) => !i.productId)) {
      return showToast('Please select products for all line items', 'error');
    }

    createMutation.mutate({
      customerId,
      warehouseId,
      discountAmount: Number(discountAmount),
      notes,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    });
  };

  const customers = customersData || [];
  const warehouses = warehouseData || [];
  const products = productsData || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Link to="/challans">
        <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Challans List</Button>
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Create Sales Challan</h1>
        <p className="text-xs text-slate-500 mt-1">Select customer, warehouse stock location & line items</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Select Customer</label>
            <select
              required
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Customer Company</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.companyName} ({c.city})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase">Warehouse Location</label>
            <select
              required
              value={warehouseId}
              onChange={(e) => setWarehouseId(e.target.value)}
              className="bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="">Select Target Warehouse</option>
              {warehouses.map((w) => (
                <option key={w.id} value={w.id}>{w.name} ({w.code})</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Line Items Table */}
        <Card className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Challan Product Line Items</h3>
            <Button type="button" variant="outline" size="sm" icon={Plus} onClick={addItemRow}>Add Product Row</Button>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/50 dark:border-slate-800/50">
                <div className="flex-1 w-full">
                  <select
                    required
                    value={item.productId}
                    onChange={(e) => handleProductChange(idx, e.target.value)}
                    className="w-full bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-slate-100"
                  >
                    <option value="">Select SKU Product</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>{p.sku} - {p.name} (Stock: {p.totalStock})</option>
                    ))}
                  </select>
                </div>

                <div className="w-full sm:w-28">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(idx, e.target.value)}
                    className="w-full bg-white dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-xl p-2 text-xs text-slate-900 dark:text-slate-100"
                    placeholder="Qty"
                  />
                </div>

                <div className="w-full sm:w-32 text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                  ₹{item.totalAmount.toFixed(2)}
                </div>

                <button
                  type="button"
                  onClick={() => removeItemRow(idx)}
                  className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Financial Summary */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col items-end space-y-1 text-sm">
            <div className="flex justify-between w-full sm:w-64 text-xs text-slate-400">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹{subTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64 text-xs text-slate-400">
              <span>GST Tax:</span>
              <span className="font-mono font-bold text-slate-900 dark:text-slate-100">₹{taxAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between w-full sm:w-64 text-xs text-slate-400 items-center py-1">
              <span>Discount (₹):</span>
              <input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                className="w-24 bg-slate-100 dark:bg-[#0B0F19] border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-0.5 text-xs text-right font-mono"
              />
            </div>
            <div className="flex justify-between w-full sm:w-64 text-base font-bold text-blue-500 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Grand Total:</span>
              <span className="font-mono">₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-2">
          <Link to="/challans">
            <Button type="button" variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" isLoading={createMutation.isPending} icon={CheckCircle2}>
            Save Draft Challan
          </Button>
        </div>
      </form>
    </div>
  );
};
