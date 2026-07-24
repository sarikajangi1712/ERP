import api from './axios';

export const customerApi = {
  getCustomers: (params) => api.get('/customers', { params }),
  getCustomerById: (id) => api.get(`/customers/${id}`),
  createCustomer: (data) => api.post('/customers', data),
  updateCustomer: (id, data) => api.put(`/customers/${id}`, data),
  deleteCustomer: (id) => api.delete(`/customers/${id}`),
  addNote: (id, noteData) => api.post(`/customers/${id}/notes`, noteData),
  exportCSV: () => api.get('/customers/export/csv', { responseType: 'blob' }),
};
