import { useQuery } from '@tanstack/react-query';
import { notificationsApi } from '@/api/notifications';

export function useNotifications(params: { pageNumber: number; pageSize: number }) {
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: async () => {
      const res = await notificationsApi.getAll(params);
      return res.data;
    },
  });
}

export function useUserNotifications(params: { pageNumber: number; pageSize: number }, enabled = true) {
  return useQuery({
    queryKey: ['notifications', 'user', params],
    queryFn: async () => {
      const res = await notificationsApi.getForUser(params);
      return res.data;
    },
    enabled,
  });
}
