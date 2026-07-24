import api from './axios';

export const reportApi = {
  getSalesReport: (params) => api.get('/reports/sales', { params }),
  getInventoryReport: () => api.get('/reports/inventory'),
  getGSTReport: () => api.get('/reports/gst'),
};
