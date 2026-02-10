import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { CreateOrderRequest } from '@/api/types';

export function useProductCategories() {
  return useQuery({
    queryKey: ['products', 'categories'],
    queryFn: async () => {
      const res = await productsApi.getEnabledCategories();
      return res.data;
    },
  });
}

export function useProductsBySalon(params: { pageNumber: number; pageSize: number; filterValue?: string }) {
  return useQuery({
    queryKey: ['products', 'bySalon', params],
    queryFn: async () => {
      const res = await productsApi.getBySalon(params);
      return res.data;
    },
  });
}

export function useProductsForMobile() {
  return useQuery({
    queryKey: ['products', 'mobile'],
    queryFn: async () => {
      const res = await productsApi.getBySalonForMobile();
      return res.data;
    },
  });
}

export function useProductDetail(productId: string, enabled = true) {
  return useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: async () => {
      const res = await productsApi.getById(productId);
      return res.data;
    },
    enabled: !!productId && enabled,
  });
}

export function useSimilarProducts(productId: string, enabled = true) {
  return useQuery({
    queryKey: ['products', 'similar', productId],
    queryFn: async () => {
      const res = await productsApi.getSimilar(productId);
      return res.data;
    },
    enabled: !!productId && enabled,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrderRequest) => productsApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useOrdersByUser(params: { pageNumber: number; pageSize: number }) {
  return useQuery({
    queryKey: ['orders', 'byUser', params],
    queryFn: async () => {
      const res = await productsApi.getOrdersByUser(params);
      return res.data;
    },
  });
}

export function useOrdersBySalon(params: { pageNumber: number; pageSize: number }) {
  return useQuery({
    queryKey: ['orders', 'bySalon', params],
    queryFn: async () => {
      const res = await productsApi.getOrdersBySalon(params);
      return res.data;
    },
  });
}
