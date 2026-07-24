export const mockDemoUsers = {
  'admin@erp.com': {
    id: 1,
    name: 'System Admin',
    email: 'admin@erp.com',
    role: 'ADMIN',
    phone: '+91 9876543210',
    department: 'Executive Management',
  },
  'sales@erp.com': {
    id: 2,
    name: 'Sales Manager',
    email: 'sales@erp.com',
    role: 'SALES',
    phone: '+91 9876543211',
    department: 'Sales & CRM Operations',
  },
  'warehouse@erp.com': {
    id: 3,
    name: 'Warehouse Lead',
    email: 'warehouse@erp.com',
    role: 'WAREHOUSE',
    phone: '+91 9876543212',
    department: 'Logistics & Stock Control',
  },
  'accounts@erp.com': {
    id: 4,
    name: 'Finance Controller',
    email: 'accounts@erp.com',
    role: 'ACCOUNTS',
    phone: '+91 9876543213',
    department: 'Accounts & GST Billing',
  },
};

export const getMockUserByEmail = (email, role) => {
  const normalized = (email || '').toLowerCase().trim();
  if (mockDemoUsers[normalized]) {
    return mockDemoUsers[normalized];
  }
  return {
    id: Date.now(),
    name: normalized.split('@')[0] || 'Enterprise User',
    email: normalized || 'user@erp.com',
    role: role || 'ADMIN',
    phone: '+91 9876543210',
    department: 'Operations',
  };
};

export const getMockResponse = (url, method = 'GET', data = null) => {
  const cleanUrl = url.split('?')[0];

  // Auth Endpoints
  if (cleanUrl.includes('/auth/login')) {
    const creds = data || {};
    const user = getMockUserByEmail(creds.email, creds.role);
    return {
      accessToken: `demo-jwt-token-${Date.now()}`,
      user,
    };
  }

  if (cleanUrl.includes('/auth/me')) {
    const savedUserStr = localStorage.getItem('user');
    const user = savedUserStr ? JSON.parse(savedUserStr) : mockDemoUsers['admin@erp.com'];
    return { user };
  }

  if (cleanUrl.includes('/auth/register') || cleanUrl.includes('/auth/phone-login') || cleanUrl.includes('/auth/google-login')) {
    const user = data?.email ? getMockUserByEmail(data.email) : mockDemoUsers['admin@erp.com'];
    return {
      accessToken: `demo-jwt-token-${Date.now()}`,
      user,
      message: 'Authentication successful',
    };
  }

  if (cleanUrl.includes('/auth/logout') || cleanUrl.includes('/auth/change-password')) {
    return { success: true, message: 'Action completed' };
  }

  // Dashboard Endpoint
  if (cleanUrl.includes('/dashboard/stats')) {
    return {
      stats: {
        totalCustomers: 48,
        totalProducts: 156,
        lowStockCount: 6,
        inventoryValue: 5420000,
        totalRevenue: 18950000,
        pendingDispatch: 12,
        overdueInvoices: 4,
      },
      charts: {
        monthlyRevenue: [
          { month: 'Jan', revenue: 1200000, target: 1000000 },
          { month: 'Feb', revenue: 1450000, target: 1200000 },
          { month: 'Mar', revenue: 1800000, target: 1500000 },
          { month: 'Apr', revenue: 1650000, target: 1500000 },
          { month: 'May', revenue: 2100000, target: 1800000 },
          { month: 'Jun', revenue: 2400000, target: 2000000 },
        ],
      },
      recentActivity: [
        { id: 1, action: 'TAX_INVOICE_GENERATED', description: 'Tax Invoice INV-2026-089 generated for Metro Supplies', timestamp: new Date().toISOString() },
        { id: 2, action: 'CHALLAN_CONFIRMED', description: 'Delivery Challan DC-104 confirmed for Central Depot', timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 3, action: 'STOCK_TRANSFER', description: 'Transferred 100 units of Industrial Bearings to South Hub', timestamp: new Date(Date.now() - 7200000).toISOString() },
        { id: 4, action: 'LEAD_CREATED', description: 'New lead Apex Engineering added to CRM pipeline', timestamp: new Date(Date.now() - 10800000).toISOString() },
      ],
    };
  }

  // Customers Endpoint
  if (cleanUrl.includes('/customers')) {
    if (cleanUrl.includes('/export/csv')) {
      return new Blob(['ID,Company,Contact,Email\n1,Metro Industrial,Rajesh,rajesh@metro.in'], { type: 'text/csv' });
    }
    return [
      { id: 1, companyName: 'Metro Industrial Supplies', contactPerson: 'Rajesh Sharma', email: 'rajesh@metrosupplies.in', phone: '+91 9820011223', stage: 'ACTIVE', tags: ['VIP', 'Wholesale'], city: 'Mumbai', totalOrders: 18, createdAt: '2026-01-15T10:30:00Z' },
      { id: 2, companyName: 'Apex Engineering Ltd', contactPerson: 'Anish Verma', email: 'averma@apexeng.co.in', phone: '+91 9845099881', stage: 'LEAD', tags: ['High Potential'], city: 'Bengaluru', totalOrders: 5, createdAt: '2026-02-10T14:20:00Z' },
      { id: 3, companyName: 'Zenith Logistics & Infra', contactPerson: 'Priya Nair', email: 'pnair@zenithinfra.com', phone: '+91 9711234567', stage: 'PROSPECT', tags: ['Infrastructure'], city: 'Delhi NCR', totalOrders: 2, createdAt: '2026-03-01T09:15:00Z' },
      { id: 4, companyName: 'Global Tech Automations', contactPerson: 'Siddharth Rao', email: 'siddharth@globaltech.io', phone: '+91 9900112233', stage: 'ACTIVE', tags: ['Enterprise', 'Automotive'], city: 'Pune', totalOrders: 24, createdAt: '2026-03-18T16:45:00Z' },
    ];
  }

  // Products & Categories
  if (cleanUrl.includes('/products/categories')) {
    return ['Hydraulics', 'Pneumatics', 'Electrical', 'Hardware', 'Fasteners', 'Raw Materials'];
  }
  if (cleanUrl.includes('/products')) {
    return [
      { id: 1, sku: 'HYD-VAL-001', name: 'High-Pressure Hydraulic Valve 3/4"', category: 'Hydraulics', price: 4500, stockQuantity: 85, minStockLevel: 15, hsnCode: '84818090', gstRate: 18, imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
      { id: 2, sku: 'PNE-CYL-204', name: 'Pneumatic Double-Acting Cylinder 50mm', category: 'Pneumatics', price: 3200, stockQuantity: 120, minStockLevel: 20, hsnCode: '84123100', gstRate: 18, imageUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=400&q=80' },
      { id: 3, sku: 'ELE-MOT-010', name: '3-Phase Induction Motor 5HP 1440RPM', category: 'Electrical', price: 18500, stockQuantity: 12, minStockLevel: 5, hsnCode: '85015210', gstRate: 18, imageUrl: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80' },
      { id: 4, sku: 'FAS-BLT-M12', name: 'SS 304 Hex Head Bolt M12 x 50mm (Pack of 100)', category: 'Fasteners', price: 1450, stockQuantity: 4, minStockLevel: 10, hsnCode: '73181500', gstRate: 18, imageUrl: 'https://images.unsplash.com/photo-1530124566582-a618bc2615dc?auto=format&fit=crop&w=400&q=80' },
    ];
  }

  // Inventory & Warehouses
  if (cleanUrl.includes('/inventory/warehouses')) {
    return [
      { id: 1, code: 'WH-01', name: 'Central Depot - Bhiwandi', location: 'Bhiwandi, Maharashtra', totalStock: 1250, capacity: 5000 },
      { id: 2, code: 'WH-02', name: 'Southern Hub - Sriperumbudur', location: 'Chennai, Tamil Nadu', totalStock: 820, capacity: 3500 },
      { id: 3, code: 'WH-03', name: 'Northern Hub - Gurgaon', location: 'Gurgaon, Haryana', totalStock: 640, capacity: 3000 },
    ];
  }
  if (cleanUrl.includes('/inventory/stock')) {
    return [
      { id: 1, productId: 1, productName: 'High-Pressure Hydraulic Valve 3/4"', warehouseName: 'Central Depot - Bhiwandi', quantity: 50, reservedQuantity: 10 },
      { id: 2, productId: 1, productName: 'High-Pressure Hydraulic Valve 3/4"', warehouseName: 'Southern Hub - Sriperumbudur', quantity: 35, reservedQuantity: 5 },
      { id: 3, productId: 2, productName: 'Pneumatic Double-Acting Cylinder 50mm', warehouseName: 'Central Depot - Bhiwandi', quantity: 120, reservedQuantity: 15 },
    ];
  }
  if (cleanUrl.includes('/inventory/movements')) {
    return [
      { id: 1, type: 'TRANSFER', productName: 'High-Pressure Hydraulic Valve 3/4"', quantity: 20, fromWarehouse: 'Central Depot', toWarehouse: 'Southern Hub', createdAt: new Date().toISOString() },
      { id: 2, type: 'ADJUSTMENT', productName: '3-Phase Induction Motor 5HP', quantity: 2, fromWarehouse: 'Northern Hub', toWarehouse: '—', createdAt: new Date(Date.now() - 86400000).toISOString() },
    ];
  }

  // Challans
  if (cleanUrl.includes('/challans')) {
    return [
      { id: 1, challanNumber: 'DC-2026-001', customerName: 'Metro Industrial Supplies', warehouseName: 'Central Depot - Bhiwandi', status: 'CONFIRMED', totalAmount: 48500, itemsCount: 4, createdAt: '2026-07-20T11:00:00Z' },
      { id: 2, challanNumber: 'DC-2026-002', customerName: 'Apex Engineering Ltd', warehouseName: 'Southern Hub - Sriperumbudur', status: 'DRAFT', totalAmount: 18500, itemsCount: 1, createdAt: '2026-07-22T15:30:00Z' },
    ];
  }

  // Invoices
  if (cleanUrl.includes('/invoices')) {
    if (cleanUrl.includes('/pdf')) {
      return new Blob(['%PDF-1.4 Mock PDF Invoice Content'], { type: 'application/pdf' });
    }
    return [
      { id: 1, invoiceNumber: 'INV-2026-001', customerName: 'Metro Industrial Supplies', totalAmount: 57230, taxAmount: 8730, status: 'PAID', dueDate: '2026-08-05', createdAt: '2026-07-21T14:30:00Z' },
      { id: 2, invoiceNumber: 'INV-2026-002', customerName: 'Global Tech Automations', totalAmount: 124000, taxAmount: 18915, status: 'PENDING', dueDate: '2026-08-12', createdAt: '2026-07-23T09:10:00Z' },
    ];
  }

  // Audit Logs
  if (cleanUrl.includes('/audit-logs')) {
    return [
      { id: 1, userName: 'System Admin', userEmail: 'admin@erp.com', action: 'USER_LOGIN', description: 'Admin authentication successful', ipAddress: '127.0.0.1', timestamp: new Date().toISOString() },
      { id: 2, userName: 'Sales Manager', userEmail: 'sales@erp.com', action: 'CREATE_CHALLAN', description: 'Created draft challan DC-2026-002', ipAddress: '127.0.0.1', timestamp: new Date(Date.now() - 1800000).toISOString() },
      { id: 3, userName: 'Warehouse Lead', userEmail: 'warehouse@erp.com', action: 'STOCK_TRANSFER', description: 'Transferred 20 units HYD-VAL-001', ipAddress: '127.0.0.1', timestamp: new Date(Date.now() - 3600000).toISOString() },
    ];
  }

  // Reports
  if (cleanUrl.includes('/reports/sales')) {
    return { totalSales: 18950000, totalOrders: 48, topCustomers: [{ name: 'Global Tech Automations', revenue: 4500000 }, { name: 'Metro Industrial Supplies', revenue: 3200000 }] };
  }
  if (cleanUrl.includes('/reports/inventory')) {
    return { totalValuation: 5420000, totalSKUs: 156, lowStockSKUs: 6 };
  }
  if (cleanUrl.includes('/reports/gst')) {
    return { totalCGST: 852750, totalSGST: 852750, totalIGST: 412500, netTaxLiability: 2118000 };
  }

  // Users
  if (cleanUrl.includes('/users')) {
    return [
      { id: 1, name: 'System Admin', email: 'admin@erp.com', role: 'ADMIN', active: true, createdAt: '2026-01-01T00:00:00Z' },
      { id: 2, name: 'Sales Manager', email: 'sales@erp.com', role: 'SALES', active: true, createdAt: '2026-01-02T00:00:00Z' },
      { id: 3, name: 'Warehouse Lead', email: 'warehouse@erp.com', role: 'WAREHOUSE', active: true, createdAt: '2026-01-03T00:00:00Z' },
      { id: 4, name: 'Finance Controller', email: 'accounts@erp.com', role: 'ACCOUNTS', active: true, createdAt: '2026-01-04T00:00:00Z' },
    ];
  }

  // Default fallback for any POST/PUT/DELETE or unmatched GET
  return { success: true, message: 'Operation completed successfully' };
};
