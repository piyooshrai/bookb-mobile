import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { servicesApi } from '@/api/services';
import { CreateServiceRequest } from '@/api/types';

export function useServiceGroups() {
  return useQuery({
    queryKey: ['services', 'grouped'],
    queryFn: async () => {
      const res = await servicesApi.getGrouped();
      return res.data;
    },
  });
}

export function useServiceGroupsBySalon(salonId: string, enabled = true) {
  return useQuery({
    queryKey: ['services', 'grouped', salonId],
    queryFn: async () => {
      const res = await servicesApi.getGroupedByCategorySalon(salonId);
      return res.data;
    },
    enabled: !!salonId && enabled,
  });
}

export function useEnabledMainServices() {
  return useQuery({
    queryKey: ['services', 'main', 'enabled'],
    queryFn: async () => {
      const res = await servicesApi.getEnabledMainServices();
      return res.data;
    },
  });
}

export function useEnabledSubServices(mainServiceId: string, enabled = true) {
  return useQuery({
    queryKey: ['services', 'sub', mainServiceId],
    queryFn: async () => {
      const res = await servicesApi.getEnabledSubServices(mainServiceId);
      return res.data;
    },
    enabled: !!mainServiceId && enabled,
  });
}

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceRequest) => servicesApi.addService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}

export function useDeleteService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (serviceId: string) => servicesApi.deleteService(serviceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
  });
}
