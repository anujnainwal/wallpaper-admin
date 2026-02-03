import api from "./api";

export interface Wallpaper {
  _id?: string;
  title: string;
  description?: string;
  image: string;
  thumbnail: string;
  category: string | { _id: string; name: string };
  tags: string[];
  format: string;
  status: string;
  createdAt?: string;
  colors?: string[];
  meta?: any;
  dimensions?: { width: number; height: number };
  fileSize?: number;
  source?: string;
  sourceUrl?: string;
  author?: string;
  license?: string;
  views?: number;
  downloads?: number;
  likes?: number;
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
    const response = await api.get<{
      success: boolean;
      data: Wallpaper[];
      pagination?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>("/wallpapers", { params });
    return response.data;
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

  bulkDelete: async (ids: string[]) => {
    const response = await api.post("/wallpapers/bulk-delete", { ids });
    return response.data;
  },
};
