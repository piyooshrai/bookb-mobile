import apiClient from './client';
import {
  ApiResponse,
  AppointmentAvailability,
  CreateAvailabilityRequest,
  CreateBulkAvailabilityRequest,
  AvailabilityRangeRequest,
  TodayActivityRequest,
  BusinessHour,
  PaginatedData,
} from './types';

export const availabilityApi = {
  create: async (data: CreateAvailabilityRequest, offset: number) => {
    const res = await apiClient.post<ApiResponse>('/appointment-availability/create-availability', data, {
      params: { offset },
    });
    return res.data;
  },

  getBySalon: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<AppointmentAvailability>>>('/appointment-availability/get-availability-by-salon', { params });
    return res.data;
  },

  getByStylist: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<AppointmentAvailability>>>('/appointment-availability/get-availability-by-stylist', { params });
    return res.data;
  },

  deleteAvailability: async (id: string) => {
    const res = await apiClient.delete<ApiResponse>('/appointment-availability/delete-availability', { params: { id } });
    return res.data;
  },

  getForMobile: async (date: string) => {
    const res = await apiClient.get<ApiResponse>('/appointment-availability/get-availability-by-stylist-for-mobile', { params: { date } });
    return res.data;
  },

  createDaily: async (data: { time: string; date: string; slotId?: string; timeData?: object; appointmentList?: string[] }, offset: number, stylistId?: string) => {
    const res = await apiClient.post<ApiResponse>('/appointment-availability/create-availability-daily', data, {
      params: { offset, stylistId },
    });
    return res.data;
  },

  createBulk: async (data: CreateBulkAvailabilityRequest, offset: number, stylistId?: string) => {
    const res = await apiClient.post<ApiResponse>('/appointment-availability/create-availability-bulk', data, {
      params: { offset, stylistId },
    });
    return res.data;
  },

  createForDay: async (date: string, offset: number, stylistId?: string) => {
    const res = await apiClient.post<ApiResponse>('/appointment-availability/create-availability-day', { date }, {
      params: { offset, stylistId },
    });
    return res.data;
  },

  getBlockStatus: async (date: string, offset: number, stylistId?: string) => {
    const res = await apiClient.get<ApiResponse>('/appointment-availability/get-appointment-list-with-block-unblock-status', {
      params: { date, offset, stylistId },
    });
    return res.data;
  },

  blockAvailability: async (date: string, stylistId?: string) => {
    const res = await apiClient.delete<ApiResponse>('/appointment-availability/block-availability', {
      params: { date, stylistId },
    });
    return res.data;
  },

  getByRange: async (data: AvailabilityRangeRequest) => {
    const res = await apiClient.post<ApiResponse<AppointmentAvailability[]>>('/appointment-availability/get-available-list-by-range', data);
    return res.data;
  },

  getBusinessHours: async (stylistId?: string) => {
    const res = await apiClient.get<ApiResponse<BusinessHour>>('/appointment-availability/get-buiness-hours', {
      params: { stylistId },
    });
    return res.data;
  },

  getTodayActivity: async (data: TodayActivityRequest, offset: number) => {
    const res = await apiClient.post<ApiResponse>('/appointment-availability/get-today-activity', data, {
      params: { offset },
    });
    return res.data;
  },
};
