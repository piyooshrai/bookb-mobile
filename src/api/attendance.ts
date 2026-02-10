import apiClient from './client';
import { ApiResponse, Attendance, AttendanceRequest, PaginatedData } from './types';

export const attendanceApi = {
  checkInOut: async (data: AttendanceRequest, offset: number) => {
    const res = await apiClient.post<ApiResponse<Attendance>>('/attendance/attendance', data, {
      params: { offset },
    });
    return res.data;
  },

  getTodayBySalon: async (offset: number) => {
    const res = await apiClient.get<ApiResponse<Attendance[]>>('/attendance/get-todays-attendance-by-salon', {
      params: { offset },
    });
    return res.data;
  },

  getByUser: async (params: { pageNumber: number; pageSize: number; offset: number; userId?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Attendance>>>('/attendance/get-attendance-by-user', { params });
    return res.data;
  },

  updateNote: async (attendanceId: string, note: string) => {
    const res = await apiClient.patch<ApiResponse>('/attendance/update-note', { note }, { params: { attendanceId } });
    return res.data;
  },

  getHistoryBySalon: async (params: { pageNumber: number; pageSize: number; offset: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Attendance>>>('/attendance/get-attendance-history-by-salon', { params });
    return res.data;
  },

  deleteAttendance: async (attendanceId: string) => {
    const res = await apiClient.delete<ApiResponse>('/attendance/delete-attendance', { params: { attendanceId } });
    return res.data;
  },
};
