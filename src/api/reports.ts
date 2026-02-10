import apiClient from './client';
import { ApiResponse } from './types';

export const reportsApi = {
  // Salon-level
  getSessionsByMonth: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-session-by-month', { params });
    return res.data;
  },

  getEarningsByMonth: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-earning-by-month', { params });
    return res.data;
  },

  getSalesByMonth: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-sales-by-month', { params });
    return res.data;
  },

  getGeneralCount: async () => {
    const res = await apiClient.get<ApiResponse>('/report/get-general-count');
    return res.data;
  },

  getEarningsChart: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-earning-by-month-for-chart', { params });
    return res.data;
  },

  getSalesChart: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-sales-by-month-for-chart', { params });
    return res.data;
  },

  getSessionsChart: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-session-by-stylist-month-wise-for-chart', { params });
    return res.data;
  },

  getDailyEarningsByStylist: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-earning-by-day-by-stylist', { params });
    return res.data;
  },

  getSessionsByStylistMonthWise: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-session-by-stylist-month-wise', { params });
    return res.data;
  },

  // Stylist-level
  getStylistGeneralCount: async () => {
    const res = await apiClient.get<ApiResponse>('/report/get-general-count-stylist');
    return res.data;
  },

  getStylistSessionsByMonth: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-session-by-month-stylist', { params });
    return res.data;
  },

  getStylistEarningsByMonth: async (params: Record<string, string | number>) => {
    const res = await apiClient.get<ApiResponse>('/report/get-total-earning-by-month-stylist', { params });
    return res.data;
  },

  // Admin
  getDashboardByDateRange: async (data: { startDate: string; endDate: string }) => {
    const res = await apiClient.post<ApiResponse>('/report/dashboard-count-by-date-range', data);
    return res.data;
  },

  getUserChart: async (data: { startDate: string; endDate: string }) => {
    const res = await apiClient.post<ApiResponse>('/report/get-user-chart', data);
    return res.data;
  },

  getAppointmentChart: async (data: { startDate: string; endDate: string }) => {
    const res = await apiClient.post<ApiResponse>('/report/get-appointment-chart', data);
    return res.data;
  },

  getUpcomingAppointments: async (data: Record<string, unknown>) => {
    const res = await apiClient.post<ApiResponse>('/report/upcoming-appointments', data);
    return res.data;
  },

  getCurrentAppointments: async (data: Record<string, unknown>) => {
    const res = await apiClient.post<ApiResponse>('/report/current-appointments', data);
    return res.data;
  },

  getAdminDashboardReport: async () => {
    const res = await apiClient.get<ApiResponse>('/report/admin-dashboard-report');
    return res.data;
  },

  getAdminSalonChart: async () => {
    const res = await apiClient.get<ApiResponse>('/report/admin-salon-report-chart');
    return res.data;
  },

  getAdminSubscription: async () => {
    const res = await apiClient.get<ApiResponse>('/report/admin-salon-subscription');
    return res.data;
  },
};
