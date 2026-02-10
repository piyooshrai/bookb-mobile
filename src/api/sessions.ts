import apiClient from './client';
import { ApiResponse, Session, AddSessionRequest, PaginatedData } from './types';

export const sessionsApi = {
  addSession: async (data: AddSessionRequest, offset: number) => {
    const res = await apiClient.post<ApiResponse<Session>>('/session/add-session', data, {
      params: { offset },
    });
    return res.data;
  },

  getByStylist: async (params: { pageNumber: number; pageSize: number; filterValue?: string; stylistId: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Session>>>('/session/get-session-by-stylist', { params });
    return res.data;
  },

  getTotalByStylist: async (params: { stylistId: string; startDate: string; endDate: string }) => {
    const res = await apiClient.get<ApiResponse>('/session/get-total-session-by-stylist', { params });
    return res.data;
  },
};
