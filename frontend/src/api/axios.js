import axios from 'axios';
import { getMockResponse } from './mockData';

const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

const envApiUrl = import.meta.env?.VITE_API_BASE_URL;

// Use env URL if present and valid for current host, otherwise default to '/api'
const baseURL = (envApiUrl && (!envApiUrl.includes('localhost') || isLocalhost))
  ? envApiUrl
  : '/api';

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Real API response or Mock Fallback on failure
api.interceptors.response.use(
  (response) => {
    // If response is HTML text (from Vercel SPA rewrite fallback for missing backend routes), fallback to mock data
    if (typeof response.data === 'string' && response.data.trim().startsWith('<!DOCTYPE html')) {
      const parsedData = getMockResponse(
        response.config.url || '', 
        response.config.method || 'GET', 
        response.config.data ? (typeof response.config.data === 'string' ? JSON.parse(response.config.data) : response.config.data) : null
      );
      return { ...response, data: parsedData };
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Try token refresh if 401 on real API
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      originalRequest._retry = true;
      try {
        const refreshUrl = `${baseURL.replace(/\/$/, '')}/auth/refresh`;
        const res = await axios.post(refreshUrl, {}, { withCredentials: true });
        if (res.data?.accessToken) {
          localStorage.setItem('token', res.data.accessToken);
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshErr) {
        // Continue to mock fallback below if refresh fails
      }
    }

    // Fallback to mock data on network errors, 404, 500, CORS, or missing backend endpoint
    try {
      let requestPayload = null;
      if (originalRequest.data) {
        requestPayload = typeof originalRequest.data === 'string' ? JSON.parse(originalRequest.data) : originalRequest.data;
      }
      const mockData = getMockResponse(originalRequest.url || '', originalRequest.method || 'GET', requestPayload);
      return {
        data: mockData,
        status: 200,
        statusText: 'OK',
        headers: {},
        config: originalRequest,
      };
    } catch (mockErr) {
      return Promise.reject(error);
    }
  }
);

export default api;
