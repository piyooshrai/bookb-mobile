import apiClient from './client';
import { ApiResponse, User, GenderReport, SalonAnalytics, PaginatedData } from './types';

export const salonApi = {
  getEnabledSalons: async () => {
    const res = await apiClient.get<ApiResponse<{ result: User[] }>>('/salon/get-enable-salon');
    return res.data;
  },

  getSettingByType: async (salonId: string, type: string) => {
    const res = await apiClient.get<ApiResponse>('/salon/get-salon-setting-by-type', {
      params: { SalonID: salonId, type },
    });
    return res.data;
  },

  getSalonByPackage: async (packageName: string) => {
    const res = await apiClient.get<ApiResponse>('/salon/get-salon-by-package', {
      params: { packageName },
    });
    return res.data;
  },

  getGenderReport: async (id: string, type: string, startDate?: string, endDate?: string) => {
    const res = await apiClient.get<ApiResponse<GenderReport[]>>(`/salon/getGenderPercentageReport/${id}/${type}`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  getAnalytics: async (salonId: string, type: string) => {
    const res = await apiClient.get<ApiResponse<SalonAnalytics[]>>(`/salon/getSalonAnalytics/${salonId}/${type}`);
    return res.data;
  },

  getCustomAnalytics: async (data: { startDate: string; endDate: string; salonId: string }) => {
    const res = await apiClient.post<ApiResponse<SalonAnalytics[]>>('/salon/getSalonCustomAnalytics', data);
    return res.data;
  },

  getAppointmentsByMonth: async (id: string) => {
    const res = await apiClient.get<ApiResponse>(`/salon/getAppointmentsByMonth/${id}`);
    return res.data;
  },

  createOrUpdate: async (data: FormData) => {
    const res = await apiClient.post<ApiResponse>('/salon/create-salon', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getSalons: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<User>>>('/salon/get-salon', { params });
    return res.data;
  },

  deleteSalon: async (salonID: string) => {
    const res = await apiClient.delete<ApiResponse>('/salon/delete-salon', { params: { salonID } });
    return res.data;
  },

  enableDisableSalon: async (userID: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/salon/enable-disable-salon', { enable }, { params: { userID } });
    return res.data;
  },

  changeMenuSetting: async (userID: string, appMenu: object) => {
    const res = await apiClient.patch<ApiResponse>('/salon/change-menu-setting', { appMenu }, { params: { userID } });
    return res.data;
  },

  getMenuSettingByToken: async (id?: string) => {
    const res = await apiClient.get<ApiResponse>('/salon/get-salon-menu-setting-by-token', { params: { id } });
    return res.data;
  },
};
