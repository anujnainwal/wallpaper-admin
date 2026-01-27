import api from "./api";

export interface Wallpaper {
  _id?: string;
  title: string;
  image: string;
  thumbnail: string;
  category: string | { _id: string; name: string };
  tags: string[];
  format: string;
  status: string;
  createdAt?: string;
}

export const wallpaperService = {
  create: async (formData: FormData) => {
    const response = await api.post<Wallpaper>("/wallpapers", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getAll: async (params?: any) => {
    const response = await api.get<{ success: boolean; data: { data: Wallpaper[]; total: number; page: number; limit: number } }>("/wallpapers", { params });
    return response.data; // returns { success, data: { data: [], ... } }
  },

  getById: async (id: string) => {
    const response = await api.get(`/wallpapers/${id}`);
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await api.put(`/wallpapers/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/wallpapers/${id}`);
    return response.data;
  },
};
