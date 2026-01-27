import api from "./api";

// Inline types if not available in a shared types file yet
export interface AdminLoginCredentials {
  email: string;
  password?: string;
  device?: {
    deviceId: string;
    deviceType: string;
    fcmToken?: string;
  };
}

export interface AuthResponse {
  user: {
    _id: string; // Backend uses _id
    name: string;
    email: string;
    role: string;
    permissions: string[];
  };
  tokens: {
      accessToken: string;
      refreshToken: string;
  };
  permissions: string[];
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const authService = {
  adminLogin: async (credentials: AdminLoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/admin/login', credentials);
    return response.data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },
  
  getCurrentUser: () => {
      // Implement if there's a /me endpoint or decode token
  }
};
