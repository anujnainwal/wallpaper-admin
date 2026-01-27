import api from "./api";

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  phoneNumber?: string;
  countryCode?: string;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  role: "user" | "admin" | "editor" | "viewer";
  accountStatus: "Active" | "Inactive" | "Suspended";
  isActive?: boolean;
  createdAt?: string;
  totalWallpapers?: number; // Virtual or aggregated field if backend provides
}

export const userService = {
  getAll: async (params?: any) => {
    // Backend returns { success, data: { data: [], total, page, limit } }
    const response = await api.get("/users", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  create: async (userData: Partial<User>) => {
    const response = await api.post("/users", userData);
    return response.data;
  },

  update: async (id: string, userData: Partial<User>) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
