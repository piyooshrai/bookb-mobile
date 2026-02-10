import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stylistApi } from '@/api/stylist';
import { useAuthStore } from '@/stores/authStore';

export function useEnabledStylists() {
  return useQuery({
    queryKey: ['stylists', 'enabled'],
    queryFn: async () => {
      const res = await stylistApi.getEnabled();
      return res.data;
    },
  });
}

export function useStylistsBySalon(filterValue?: string) {
  return useQuery({
    queryKey: ['stylists', 'bySalon', filterValue],
    queryFn: async () => {
      const res = await stylistApi.getBySalon(filterValue);
      return res.data;
    },
  });
}

export function useStylistDayAppointments(date: string, enabled = true) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['stylist', 'dayAppointments', user?._id, date],
    queryFn: async () => {
      const res = await stylistApi.getDayWiseAppointments(user!._id, date);
      return res.data;
    },
    enabled: !!user?._id && enabled,
  });
}

export function useStylistAnalytics(type: 'monthly' | 'yearly' = 'monthly') {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['stylist', 'analytics', user?._id, type],
    queryFn: async () => {
      const res = await stylistApi.getAnalytics(user!._id, type);
      return res.data;
    },
    enabled: !!user?._id,
  });
}

export function useStylistLatestAppointment() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['stylist', 'latest', user?._id],
    queryFn: async () => {
      const res = await stylistApi.getLatestAppointment(user!._id);
      return res.data;
    },
    enabled: !!user?._id,
  });
}

export function useStylistAppointmentsByMonth() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['stylist', 'appointmentsByMonth', user?._id],
    queryFn: async () => {
      const res = await stylistApi.getAppointmentsByMonth(user!._id);
      return res.data;
    },
    enabled: !!user?._id,
  });
}

export function useStylistGenderReport(type: 'monthly' | 'yearly' = 'monthly') {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['stylist', 'gender', user?._id, type],
    queryFn: async () => {
      const res = await stylistApi.getGenderReport(user!._id, type);
      return res.data;
    },
    enabled: !!user?._id,
  });
}

export function useUpdateStylistNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ user, note }: { user: string; note: string }) =>
      stylistApi.updateNote(user, { userNote: note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stylist', 'notes'] });
    },
  });
}

export function useStylistNote(userId: string, enabled = true) {
  return useQuery({
    queryKey: ['stylist', 'notes', userId],
    queryFn: async () => {
      const res = await stylistApi.getNote(userId);
      return res.data;
    },
    enabled: !!userId && enabled,
  });
}

export function useStylistSettings(stylistId: string, enabled = true) {
  return useQuery({
    queryKey: ['stylist', 'settings', stylistId],
    queryFn: async () => {
      const res = await stylistApi.getSettings(stylistId);
      return res.data;
    },
    enabled: !!stylistId && enabled,
  });
}
