import api from "./api";

export interface Integration {
  _id?: string;
  key: string;
  name: string;
  type: string;
  config: any;
  isActive: boolean;
}

export const integrationService = {
  getAll: async () => {
    const response = await api.get("/integrations");
    return response.data;
  },

  save: async (data: Partial<Integration>) => {
    const response = await api.post("/integrations", data);
    return response.data;
  },
};
