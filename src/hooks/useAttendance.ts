import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi } from '@/api/attendance';
import { AttendanceAction } from '@/api/types';

export function useTodayAttendance(offset: number) {
  return useQuery({
    queryKey: ['attendance', 'today', offset],
    queryFn: async () => {
      const res = await attendanceApi.getTodayBySalon(offset);
      return res.data ?? null;
    },
  });
}

export function useAttendanceHistory(params: { pageNumber: number; pageSize: number; offset: number; filterValue?: string }) {
  return useQuery({
    queryKey: ['attendance', 'history', params],
    queryFn: async () => {
      const res = await attendanceApi.getHistoryBySalon(params);
      return res.data ?? null;
    },
  });
}

export function useCheckInOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ stylistId, action, note, offset }: { stylistId: string; action: AttendanceAction; note?: string; offset: number }) =>
      attendanceApi.checkInOut({ stylistId, action, note }, offset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attendance'] });
    },
  });
}

export function useUserAttendance(params: { pageNumber: number; pageSize: number; offset: number; userId?: string }) {
  return useQuery({
    queryKey: ['attendance', 'user', params],
    queryFn: async () => {
      const res = await attendanceApi.getByUser(params);
      return res.data ?? null;
    },
  });
}
