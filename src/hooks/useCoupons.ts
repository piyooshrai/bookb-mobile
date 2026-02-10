import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { couponsApi } from '@/api/coupons';
import { CreateCouponRequest } from '@/api/types';

export function useActiveCoupons() {
  return useQuery({
    queryKey: ['coupons', 'active'],
    queryFn: async () => {
      const res = await couponsApi.getActiveCoupons();
      return res.data;
    },
  });
}

export function useSalonCoupons(params: { pageNumber: number; pageSize: number }) {
  return useQuery({
    queryKey: ['coupons', 'salon', params],
    queryFn: async () => {
      const res = await couponsApi.getCoupons(params);
      return res.data;
    },
  });
}

export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCouponRequest) => couponsApi.addCoupon(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponId: string) => couponsApi.deleteCoupon(couponId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
    },
  });
}

export function useVerifyCoupon() {
  return useMutation({
    mutationFn: ({ code, salon }: { code: string; salon: string }) =>
      couponsApi.verifyCoupon(code, salon),
  });
}

export function useAdminCoupons() {
  return useQuery({
    queryKey: ['coupons', 'admin'],
    queryFn: async () => {
      const res = await couponsApi.getAdminCoupons();
      return res.data;
    },
  });
}
