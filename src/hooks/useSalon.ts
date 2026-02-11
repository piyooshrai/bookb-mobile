import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { salonApi } from '@/api/salon';
import { useAuthStore } from '@/stores/authStore';

export function useSalonAnalytics(type: 'monthly' | 'yearly' = 'monthly') {
  const { salonId } = useAuthStore();

  return useQuery({
    queryKey: ['salon', 'analytics', salonId, type],
    queryFn: async () => {
      const res = await salonApi.getAnalytics(salonId!, type);
      return res.data ?? null;
    },
    enabled: !!salonId,
  });
}

export function useSalonGenderReport(type: 'monthly' | 'yearly' = 'monthly') {
  const { salonId } = useAuthStore();

  return useQuery({
    queryKey: ['salon', 'gender', salonId, type],
    queryFn: async () => {
      const res = await salonApi.getGenderReport(salonId!, type);
      return res.data ?? null;
    },
    enabled: !!salonId,
  });
}

export function useSalonAppointmentsByMonth() {
  const { salonId } = useAuthStore();

  return useQuery({
    queryKey: ['salon', 'appointmentsByMonth', salonId],
    queryFn: async () => {
      const res = await salonApi.getAppointmentsByMonth(salonId!);
      return res.data ?? null;
    },
    enabled: !!salonId,
  });
}

export function useEnabledSalons() {
  return useQuery({
    queryKey: ['salons', 'enabled'],
    queryFn: async () => {
      const res = await salonApi.getEnabledSalons();
      return res.data ?? null;
    },
  });
}

export function useSalonList(params: { pageNumber: number; pageSize: number; filterValue?: string }) {
  return useQuery({
    queryKey: ['salons', 'list', params],
    queryFn: async () => {
      const res = await salonApi.getSalons(params);
      return res.data ?? null;
    },
  });
}

export function useDeleteSalon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (salonID: string) => salonApi.deleteSalon(salonID),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salons'] });
    },
  });
}

export function useEnableDisableSalon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userID, enable }: { userID: string; enable: boolean }) =>
      salonApi.enableDisableSalon(userID, enable),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salons'] });
    },
  });
}
