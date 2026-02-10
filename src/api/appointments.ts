import apiClient from './client';
import {
  ApiResponse,
  Appointment,
  CreateAppointmentRequest,
  GetAppointmentsRequest,
  AvailableSlotsRequest,
  ChangeAppointmentStatusRequest,
  ConfirmAppointmentRequest,
  PaginatedData,
  AppointmentStatus,
} from './types';

export const appointmentsApi = {
  createFromDashboard: async (data: CreateAppointmentRequest, offset: number) => {
    const res = await apiClient.post<ApiResponse<Appointment>>('/appointment/add-appointment-from-dashboard', data, {
      params: { offset },
    });
    return res.data;
  },

  getFromDashboard: async (data: GetAppointmentsRequest) => {
    const res = await apiClient.post<ApiResponse<Appointment[]>>('/appointment/get-appointment-from-dashboard', data);
    return res.data;
  },

  getAvailableByDate: async (data: AvailableSlotsRequest, offset: number) => {
    const res = await apiClient.post<ApiResponse>('/appointment/get-available-appointment-by-date', data, {
      params: { offset },
    });
    return res.data;
  },

  confirmAppointment: async (data: ConfirmAppointmentRequest) => {
    const res = await apiClient.post<ApiResponse>('/appointment/confirm-appointment', data);
    return res.data;
  },

  getByStylist: async (params: { pageNumber: number; pageSize: number; filterValue?: string; stylistId?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Appointment>>>('/appointment/get-appointment-by-stylist', { params });
    return res.data;
  },

  getHistoryByUser: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Appointment>>>('/appointment/get-appointment-history-by-user', { params });
    return res.data;
  },

  deleteAppointment: async (appointmentId: string) => {
    const res = await apiClient.delete<ApiResponse>('/appointment/delete-appointment', { params: { appointmentId } });
    return res.data;
  },

  deleteFromDashboard: async (appointmentId: string) => {
    const res = await apiClient.delete<ApiResponse>(`/appointment/delete-appointment-dashboard/${appointmentId}`);
    return res.data;
  },

  changeStatus: async (id: string, data: ChangeAppointmentStatusRequest) => {
    const res = await apiClient.patch<ApiResponse>('/appointment/change-status-of-appointment', data, { params: { id } });
    return res.data;
  },

  getLatestByUser: async () => {
    const res = await apiClient.get<ApiResponse<Appointment>>('/appointment/get-latest-appointment-by-user');
    return res.data;
  },

  getConversionRate: async (salon: string) => {
    const res = await apiClient.get<ApiResponse<{ conversionRate: number }>>('/appointment/appointment-conversion-rate', { params: { salon } });
    return res.data;
  },

  getRetentionRate: async (salon: string) => {
    const res = await apiClient.get<ApiResponse<{ retentionRate: number }>>('/appointment/customer-retention-rate', { params: { salon } });
    return res.data;
  },

  getAverageTicketValue: async (salon: string) => {
    const res = await apiClient.get<ApiResponse<{ averageTicketValue: number }>>('/appointment/average-ticket-value', { params: { salon } });
    return res.data;
  },

  getDetail: async (appointmentId: string) => {
    const res = await apiClient.get<ApiResponse<Appointment>>('/appointment/get-appointment-detail', { params: { appointmentId } });
    return res.data;
  },

  getStatusList: async () => {
    const res = await apiClient.get<ApiResponse<AppointmentStatus[]>>('/appointment/get-appointment-status-list');
    return res.data;
  },

  getUserActivity: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse>('/appointment/get-user-activity', { params });
    return res.data;
  },

  bookWithoutSlot: async (data: CreateAppointmentRequest) => {
    const res = await apiClient.post<ApiResponse<Appointment>>('/appointment/bookAppointmentWithoutSlot', data);
    return res.data;
  },
};
