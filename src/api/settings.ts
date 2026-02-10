import apiClient from './client';
import { ApiResponse, WebsiteSetting } from './types';

export const settingsApi = {
  // Website settings
  getByName: async (name: string) => {
    const res = await apiClient.get<ApiResponse<WebsiteSetting>>('/website/get-website-setting-by-name', { params: { name } });
    return res.data;
  },

  getBySalon: async (salon: string) => {
    const res = await apiClient.get<ApiResponse<WebsiteSetting>>('/website/get-website-setting-by-salon', { params: { salon } });
    return res.data;
  },

  addWebsiteSetting: async (data: FormData) => {
    const res = await apiClient.post<ApiResponse>('/website/add-website-setting', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getWebsiteSetting: async () => {
    const res = await apiClient.get<ApiResponse<WebsiteSetting>>('/website/get-website-setting');
    return res.data;
  },

  getBusinessHours: async () => {
    const res = await apiClient.get<ApiResponse>('/website/get-business-hour');
    return res.data;
  },

  // App settings
  addAppSetting: async (data: FormData) => {
    const res = await apiClient.post<ApiResponse>('/app/add-app-setting', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getAppSetting: async () => {
    const res = await apiClient.get<ApiResponse>('/app/get-app-setting');
    return res.data;
  },

  getAppSettingById: async (salonId: string) => {
    const res = await apiClient.get<ApiResponse>('/app/get-app-setting-by-id', { params: { salonId } });
    return res.data;
  },
};
