import apiClient from './client';
import {
  ApiResponse,
  User,
  Appointment,
  StylistSettingsRequest,
  StylistNoteRequest,
  StylistDayAppointment,
  GenderReport,
  SalonAnalytics,
  PaginatedData,
} from './types';

export const stylistApi = {
  create: async (data: FormData) => {
    const res = await apiClient.post<ApiResponse>('/stylist/create-stylist', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getStylists: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<User>>>('/stylist/get-stylist', { params });
    return res.data;
  },

  deleteStylist: async (stylistId: string) => {
    const res = await apiClient.delete<ApiResponse>('/stylist/delete-stylist', { params: { stylistId } });
    return res.data;
  },

  enableDisable: async (userID: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/stylist/enable-disable-stylist', { enable }, { params: { userID } });
    return res.data;
  },

  getEnabled: async () => {
    const res = await apiClient.get<ApiResponse<User[]>>('/stylist/get-enable-stylist');
    return res.data;
  },

  updateServices: async (services: string[]) => {
    const res = await apiClient.patch<ApiResponse>('/stylist/update-stylist-services', { services });
    return res.data;
  },

  addSettings: async (data: StylistSettingsRequest) => {
    const res = await apiClient.post<ApiResponse>('/stylist/add-stylist-settings', data);
    return res.data;
  },

  getSettings: async (stylistId: string) => {
    const res = await apiClient.get<ApiResponse>('/stylist/get-stylist-settings', { params: { stylistId } });
    return res.data;
  },

  updateNote: async (user: string, data: StylistNoteRequest) => {
    const res = await apiClient.put<ApiResponse>('/stylist/note', data, { params: { user } });
    return res.data;
  },

  getNote: async (user: string) => {
    const res = await apiClient.get<ApiResponse>('/stylist/note', { params: { user } });
    return res.data;
  },

  getBySalon: async (filterValue?: string) => {
    const res = await apiClient.get<ApiResponse<User[]>>('/stylist/get-stylist-by-salon', { params: { filterValue } });
    return res.data;
  },

  getRecentAppointments: async (stylistId: string, status: string) => {
    const res = await apiClient.get<ApiResponse<Appointment[]>>(`/stylist/getRecentAppointment/${stylistId}/${status}`);
    return res.data;
  },

  getAnalytics: async (stylistId: string, type: string) => {
    const res = await apiClient.get<ApiResponse<SalonAnalytics[]>>(`/stylist/getStylistAnalytics/${stylistId}/${type}`);
    return res.data;
  },

  getCustomAnalytics: async (data: { startDate: string; endDate: string; stylistId: string }) => {
    const res = await apiClient.post<ApiResponse<SalonAnalytics[]>>('/stylist/getStylistCustomAnalytics', data);
    return res.data;
  },

  getAppointmentInfo: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Appointment>>(`/stylist/appointmentInfo/${id}`);
    return res.data;
  },

  getLatestAppointment: async (id: string) => {
    const res = await apiClient.get<ApiResponse>(`/stylist/getLatestAppointment/${id}`);
    return res.data;
  },

  getAppointmentsByMonth: async (id: string) => {
    const res = await apiClient.get<ApiResponse>(`/stylist/getAppointmentsByMonth/${id}`);
    return res.data;
  },

  getGenderReport: async (id: string, type: string, startDate?: string, endDate?: string) => {
    const res = await apiClient.get<ApiResponse<GenderReport[]>>(`/stylist/getGenderPercentageReport/${id}/${type}`, {
      params: { startDate, endDate },
    });
    return res.data;
  },

  getDayWiseAppointments: async (id: string, date: string) => {
    const res = await apiClient.get<ApiResponse<StylistDayAppointment[]>>(`/stylist/getDayWiseAppointment/${id}`, {
      params: { date },
    });
    return res.data;
  },
};
