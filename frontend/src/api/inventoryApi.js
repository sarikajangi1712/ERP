import api from './axios';

export const inventoryApi = {
  getStockLevels: (params) => api.get('/inventory/stock', { params }),
  getWarehouses: () => api.get('/inventory/warehouses'),
  getMovements: () => api.get('/inventory/movements'),
  adjustStock: (data) => api.post('/inventory/adjust', data),
  transferStock: (data) => api.post('/inventory/transfer', data),
};
