import api from './axios';

export const challanApi = {
  getChallans: (params) => api.get('/challans', { params }),
  getChallanById: (id) => api.get(`/challans/${id}`),
  createChallan: (data) => api.post('/challans', data),
  confirmChallan: (id) => api.post(`/challans/${id}/confirm`),
  cancelChallan: (id) => api.post(`/challans/${id}/cancel`),
};
