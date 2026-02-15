import api from './api';

export const getLandingPageConfig = async () => {
  const response = await api.get('/landing-page/admin');
  return response.data;
};

export const updateLandingPageConfig = async (data: any) => {
  const response = await api.put('/landing-page/admin', data);
  return response.data;
};
