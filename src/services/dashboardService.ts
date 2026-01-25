import api from './api';

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    growth: number;
  };
  devices: {
    android: number;
    ios: number;
    distribution: {
      android: number;
      ios: number;
    };
  };
  wallpapers: {
    total: number;
    active: number;
    pending: number;
    recent: Array<{
      title: string;
      category: string;
      downloads: number;
      status: string;
    }>;
  };
  countries: Array<{
    country: string;
    users: number;
    flag: string;
    color: string;
  }>;
  userActivity: Array<{
    name: string;
    active: number;
  }>;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardService = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard/stats');
    return response.data.data;
  },
};
