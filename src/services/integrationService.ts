import api from "./api";

export interface Integration {
  _id?: string;
  key: string;
  name: string;
  type: string;
  config: any;
  isActive: boolean;
  schedule?: string;
  lastSyncAt?: string | null;
  syncStatus?: string;
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

  checkConnection: async (key: string) => {
    const response = await api.post("/integrations/check-connection", { key });
    return response.data;
  },

  triggerSync: async (key: string) => {
    const response = await api.post("/integrations/sync", { key });
    return response.data;
  },
};
