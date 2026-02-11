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
      console.log('[useDashboardAppts] query body:', JSON.stringify(data));
      console.log('[useDashboardAppts] response:', JSON.stringify(res).slice(0, 500));
      // Diagnostic: broad query with no stylist and wide date range
      try {
        const broad = await appointmentsApi.getFromDashboard({ salon: data.salon, fromDate: '2026-01-01', toDate: '2026-12-31', offset: data.offset });
        console.log('[useDashboardAppts] BROAD (no stylist, year):', JSON.stringify(broad).slice(0, 800));
      } catch (e: any) { console.log('[useDashboardAppts] BROAD error:', e.message); }
      return res.data ?? (res as any).result ?? null;
    },
    enabled,
  });
}

export function useAvailableSlots(data: AvailableSlotsRequest, offset: number, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'slots', data],
    queryFn: async () => {
      const res = await appointmentsApi.getAvailableByDate(data, offset);
      return res.data ?? null;
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
      return res.data ?? null;
    },
    enabled: !!appointmentId && enabled,
  });
}

export function useLatestAppointment() {
  return useQuery({
    queryKey: ['appointments', 'latest'],
    queryFn: async () => {
      const res = await appointmentsApi.getLatestByUser();
      return res.data ?? null;
    },
  });
}

export function useUserActivity(params: { pageNumber: number; pageSize: number; filterValue?: string }) {
  return useQuery({
    queryKey: ['appointments', 'activity', params],
    queryFn: async () => {
      const res = await appointmentsApi.getUserActivity(params);
      return res.data ?? null;
    },
  });
}

export function useAppointmentHistory(params: { pageNumber: number; pageSize: number; filterValue?: string }, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'history', params],
    queryFn: async () => {
      const res = await appointmentsApi.getHistoryByUser(params);
      return res.data ?? null;
    },
    enabled,
  });
}

export function useAppointmentsByStylist(params: { pageNumber: number; pageSize: number; filterValue?: string; stylistId?: string }, enabled = true) {
  return useQuery({
    queryKey: ['appointments', 'byStylist', params],
    queryFn: async () => {
      const res = await appointmentsApi.getByStylist(params);
      return res.data ?? null;
    },
    enabled,
  });
}

export function useAppointmentMetrics(salonId: string) {
  const conversionRate = useQuery({
    queryKey: ['appointments', 'conversion', salonId],
    queryFn: async () => {
      const res = await appointmentsApi.getConversionRate(salonId);
      return res.data ?? null;
    },
    enabled: !!salonId,
  });

  const retentionRate = useQuery({
    queryKey: ['appointments', 'retention', salonId],
    queryFn: async () => {
      const res = await appointmentsApi.getRetentionRate(salonId);
      return res.data ?? null;
    },
    enabled: !!salonId,
  });

  const avgTicketValue = useQuery({
    queryKey: ['appointments', 'avgTicket', salonId],
    queryFn: async () => {
      const res = await appointmentsApi.getAverageTicketValue(salonId);
      return res.data ?? null;
    },
    enabled: !!salonId,
  });

  return { conversionRate, retentionRate, avgTicketValue };
}
