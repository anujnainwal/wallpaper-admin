import api from './api';

export interface LegalDocument {
  id?: string;
  _id?: string;
  title: string;
  slug: string;
  type: 'terms' | 'privacy' | 'disclaimer' | 'eula';
  version: string;
  content: string;
  effectiveDate: string;
  status: 'published' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export const legalDocumentService = {
  getAll: async () => {
    const response = await api.get('/legal-documents');
    return response.data;
  },

  getByType: async (type: string) => {
    const response = await api.get(`/legal-documents/${type}`);
    return response.data;
  },

  create: async (data: LegalDocument) => {
    const response = await api.post('/legal-documents', data);
    return response.data;
  },

  update: async (id: string, data: Partial<LegalDocument>) => {
    const response = await api.put(`/legal-documents/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/legal-documents/${id}`);
    return response.data;
  },
};
