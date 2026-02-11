import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { availabilityApi } from '@/api/availability';
import { CreateBulkAvailabilityRequest, AvailabilityRangeRequest, TodayActivityRequest } from '@/api/types';

export function useAvailabilityByRange(data: AvailabilityRangeRequest, enabled = true) {
  return useQuery({
    queryKey: ['availability', 'range', data],
    queryFn: async () => {
      const res = await availabilityApi.getByRange(data);
      return res.data ?? null;
    },
    enabled,
  });
}

export function useBusinessHours(stylistId?: string) {
  return useQuery({
    queryKey: ['availability', 'businessHours', stylistId],
    queryFn: async () => {
      const res = await availabilityApi.getBusinessHours(stylistId);
      return res.data ?? null;
    },
  });
}

export function useBlockStatus(date: string, offset: number, stylistId?: string, enabled = true) {
  return useQuery({
    queryKey: ['availability', 'blockStatus', date, stylistId],
    queryFn: async () => {
      const res = await availabilityApi.getBlockStatus(date, offset, stylistId);
      return res.data ?? null;
    },
    enabled,
  });
}

export function useTodayActivity(data: TodayActivityRequest, offset: number, enabled = true) {
  return useQuery({
    queryKey: ['availability', 'today', data],
    queryFn: async () => {
      const res = await availabilityApi.getTodayActivity(data, offset);
      return res.data ?? null;
    },
    enabled,
  });
}

export function useCreateBulkAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data, offset, stylistId }: { data: CreateBulkAvailabilityRequest; offset: number; stylistId?: string }) =>
      availabilityApi.createBulk(data, offset, stylistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}

export function useBlockAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date, stylistId }: { date: string; stylistId?: string }) =>
      availabilityApi.blockAvailability(date, stylistId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
    },
  });
}

export function useMobileAvailability(date: string, enabled = true) {
  return useQuery({
    queryKey: ['availability', 'mobile', date],
    queryFn: async () => {
      const res = await availabilityApi.getForMobile(date);
      return res.data ?? null;
    },
    enabled,
  });
}
