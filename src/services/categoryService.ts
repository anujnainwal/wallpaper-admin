import api from './api';

export interface Category {
  id: string; // Mapped from _id
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: { _id: string; name: string; slug: string } | null;
  isActive: boolean;
  order: number;
  subcategories?: Category[];
  createdAt: string;
}

// interface CategoryResponse {
//   success: boolean;
//   message: string;
//   data: Category | Category[];
//   // Pagination info if list
//   total?: number;
//   page?: number;
//   limit?: number;
// }

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const response = await api.get('/categories', { params: { limit: 100, isActive: true } });
    return response.data.data.data;
  },

  getAll: async (params?: any): Promise<{ data: Category[]; total: number }> => {
    // If querying root categories, ensure params.parent is string 'null' if intended, 
    // or handled by UI state.
    const response = await api.get('/categories', { params });
    // Assuming backend returns { success: true, data: { data: [], total: ... } } OR { success: true, data: [] }
    // Adjust based on backend controller formatting.
    // Controller calls ResponseUtil.success(res, result);
    // Service returns { data, total, page, limit }
    // So response.data.data will have { data, total ... }
    return response.data.data; 
  },

  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/categories/${id}`);
    return response.data.data;
  },

  create: async (data: Partial<Category> | FormData): Promise<Category> => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined;
    
    const response = await api.post('/categories', data, { headers });
    return response.data.data;
  },

  update: async (id: string, data: Partial<Category> | FormData): Promise<Category> => {
    const isFormData = data instanceof FormData;
    const headers = isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined;

    const response = await api.patch(`/categories/${id}`, data, { headers });
    return response.data.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/categories/${id}`);
  },
};
