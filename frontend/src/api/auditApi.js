import api from './axios';

export const auditApi = {
  getAuditLogs: (params) => api.get('/audit-logs', { params }),
};
