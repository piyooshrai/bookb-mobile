import apiClient from './client';
import { ApiResponse, Notification, SendNotificationRequest, PaginatedData } from './types';

export const notificationsApi = {
  send: async (data: SendNotificationRequest) => {
    const res = await apiClient.post<ApiResponse>('/notification/send-notification', data);
    return res.data;
  },

  getAll: async (params: { pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Notification>>>('/notification/get-notification', { params });
    return res.data;
  },

  getForUser: async (params: { pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Notification>>>('/notification/get-notification-for-user', { params });
    return res.data;
  },

  sendToUser: async (data: { title: string; body: string; userId: string }) => {
    const res = await apiClient.post<ApiResponse>('/notification/send-notification-by-user', data);
    return res.data;
  },
};
