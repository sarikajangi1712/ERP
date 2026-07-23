import api from './axios';

export const userApi = {
  getUsers: () => api.get('/users'),
  createUser: (data) => api.post('/users', data),
  toggleUserStatus: (id) => api.patch(`/users/${id}/toggle-status`),
};
