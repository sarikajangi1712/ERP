import api from './axios';

export const invoiceApi = {
  getInvoices: (params) => api.get('/invoices', { params }),
  getInvoiceById: (id) => api.get(`/invoices/${id}`),
  generateFromChallan: (challanId) => api.post(`/invoices/generate-from-challan/${challanId}`),
  updatePayment: (id, data) => api.patch(`/invoices/${id}/payment`, data),
  downloadPDF: (id) => api.get(`/invoices/${id}/pdf`, { responseType: 'blob' }),
};
