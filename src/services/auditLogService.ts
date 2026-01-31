import api from './api';

export interface AuditLog {
  _id: string;
  id?: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  entityId?: string;
  details?: string;
  ipAddress: string;
  userAgent?: string;
  createdAt: string;
  status: "success" | "failure" | "warning";
}

interface GetAuditLogsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

interface AuditLogsResponse {
  data: AuditLog[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getAuditLogs = async (
  params: GetAuditLogsParams,
): Promise<AuditLogsResponse> => {
  const response = await api.get('/audit-logs', { params });
  return response.data.data;
};

export const bulkDeleteAuditLogs = async (ids: string[]) => {
  const response = await api.post('/audit-logs/bulk-delete', { ids });
  return response.data;
};
