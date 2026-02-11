import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';

export function useGeneralCount() {
  return useQuery({
    queryKey: ['reports', 'generalCount'],
    queryFn: async () => {
      const res = await reportsApi.getGeneralCount();
      return res.data ?? null;
    },
  });
}

export function useEarningsByMonth(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['reports', 'earnings', params],
    queryFn: async () => {
      const res = await reportsApi.getEarningsByMonth(params);
      return res.data ?? null;
    },
  });
}

export function useEarningsChart(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['reports', 'earningsChart', params],
    queryFn: async () => {
      const res = await reportsApi.getEarningsChart(params);
      return res.data ?? null;
    },
  });
}

export function useSalesChart(params: Record<string, string | number>) {
  return useQuery({
    queryKey: ['reports', 'salesChart', params],
    queryFn: async () => {
      const res = await reportsApi.getSalesChart(params);
      return res.data ?? null;
    },
  });
}

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['reports', 'adminDashboard'],
    queryFn: async () => {
      const res = await reportsApi.getAdminDashboardReport();
      return res.data ?? null;
    },
  });
}

export function useAdminSalonChart() {
  return useQuery({
    queryKey: ['reports', 'adminSalonChart'],
    queryFn: async () => {
      const res = await reportsApi.getAdminSalonChart();
      return res.data ?? null;
    },
  });
}

export function useAdminSubscription() {
  return useQuery({
    queryKey: ['reports', 'adminSubscription'],
    queryFn: async () => {
      const res = await reportsApi.getAdminSubscription();
      return res.data ?? null;
    },
  });
}

export function useStylistGeneralCount() {
  return useQuery({
    queryKey: ['reports', 'stylistGeneral'],
    queryFn: async () => {
      const res = await reportsApi.getStylistGeneralCount();
      return res.data ?? null;
    },
  });
}
