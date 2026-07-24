import api from './axios';

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  googleLogin: (data) => api.post('/auth/google-login', data),
  register: (data) => api.post('/auth/register', data),
  loginWithPhoneOtp: (data) => api.post('/auth/phone-login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
  logout: () => api.post('/auth/logout'),
};
