import api from './api';

export interface AuditLog {
  _id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  createdAt: string;
}

export interface AuditLogResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const auditLogService = {
  getLogs: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
  }) => {
    // The API returns { success: true, data: { data: [], meta: {} } }
    // We explicitly type the axios GET to 'any' or a wrapper type to avoid TS confusion, 
    // then return the inner data payload.
    const response = await api.get('/audit-logs', { params });
    return response.data.data;
  },
};
