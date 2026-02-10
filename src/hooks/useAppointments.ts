import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { appointmentsApi } from '@/api/appointments';
import {
  CreateAppointmentRequest,
  GetAppointmentsRequest,
  AvailableSlotsRequest,
  ChangeAppointmentStatusRequest,
  ConfirmAppointmentRequest,
  AppointmentStatus,
} from '@/api/types';

export function useCreateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, offset }: { data: CreateAppointmentRequest; offset: number }) =>
      appointmentsApi.createFromDashboard(data, offset),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDashboardAppointments(data: GetAppointmentsRequest, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'dashboard', data],
    queryFn: async () => {
      const res = await appointmentsApi.getFromDashboard(data);
      return res.data ?? (res as any).result;
    },
    enabled,
  });
}

export function useAvailableSlots(data: AvailableSlotsRequest, offset: number, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'slots', data],
    queryFn: async () => {
      const res = await appointmentsApi.getAvailableByDate(data, offset);
      return res.data;
    },
    enabled,
  });
}

export function useConfirmAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ConfirmAppointmentRequest) => appointmentsApi.confirmAppointment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useChangeAppointmentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ChangeAppointmentStatusRequest }) =>
      appointmentsApi.changeStatus(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useDeleteAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (appointmentId: string) => appointmentsApi.deleteFromDashboard(appointmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
}

export function useAppointmentDetail(appointmentId: string, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'detail', appointmentId],
    queryFn: async () => {
      const res = await appointmentsApi.getDetail(appointmentId);
      return res.data;
    },
    enabled: !!appointmentId && enabled,
  });
}

export function useLatestAppointment() {
  return useQuery({
    queryKey: ['appointments', 'latest'],
    queryFn: async () => {
      const res = await appointmentsApi.getLatestByUser();
      return res.data;
    },
  });
}

export function useUserActivity(params: { pageNumber: number; pageSize: number; filterValue?: string }) {
  return useQuery({
    queryKey: ['appointments', 'activity', params],
    queryFn: async () => {
      const res = await appointmentsApi.getUserActivity(params);
      return res.data;
    },
  });
}

export function useAppointmentHistory(params: { pageNumber: number; pageSize: number; filterValue?: string }, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'history', params],
    queryFn: async () => {
      const res = await appointmentsApi.getHistoryByUser(params);
      return res.data;
    },
    enabled,
  });
}

export function useAppointmentsByStylist(params: { pageNumber: number; pageSize: number; filterValue?: string; stylistId?: string }, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'byStylist', params],
    queryFn: async () => {
      const res = await appointmentsApi.getByStylist(params);
      return res.data;
    },
    enabled,
  });
}

export function useAppointmentMetrics(salonId: string) {
  const conversionRate = useQuery({
    queryKey: ['appointments', 'conversion', salonId],
    queryFn: async () => {
      const res = await appointmentsApi.getConversionRate(salonId);
      return res.data;
    },
    enabled: !!salonId,
  });

  const retentionRate = useQuery({
    queryKey: ['appointments', 'retention', salonId],
    queryFn: async () => {
      const res = await appointmentsApi.getRetentionRate(salonId);
      return res.data;
    },
    enabled: !!salonId,
  });

  const avgTicketValue = useQuery({
    queryKey: ['appointments', 'avgTicket', salonId],
    queryFn: async () => {
      const res = await appointmentsApi.getAverageTicketValue(salonId);
      return res.data;
    },
    enabled: !!salonId,
  });

  return { conversionRate, retentionRate, avgTicketValue };
}
