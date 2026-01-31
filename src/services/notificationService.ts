import api from './api';

export interface Notification {
  _id: string;
  title: string;
  body: string;
  status: 'pending' | 'queued' | 'sending' | 'sent' | 'failed' | 'cancelled';
  target: {
    type: 'all' | 'topic' | 'tokens' | 'users';
    value?: any;
  };
  image?: string;
  data?: Record<string, any>;
  scheduledAt?: string;
  createdAt: string;
  meta?: {
    successCount: number;
    failureCount: number;
  };
}

export interface NotificationResponse {
  data: Notification[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getNotifications = async (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const response = await api.get<any>('/notifications', { params });
  return response.data.data; // Unwrap the generic API response 'data' field
};

export const createNotification = async (data: Partial<Notification>) => {
  const response = await api.post('/notifications', data);
  return response.data;
};

export const deleteNotification = async (id: string) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const bulkDeleteNotifications = async (ids: string[]) => {
  const response = await api.post("/notifications/bulk-delete", { ids });
  return response.data;
};
