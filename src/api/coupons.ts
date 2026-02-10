import apiClient from './client';
import { ApiResponse, Coupon, CreateCouponRequest, PaginatedData } from './types';

export const couponsApi = {
  // Public
  verifyCoupon: async (code: string, salon: string) => {
    const res = await apiClient.get<ApiResponse<Coupon>>('/coupon/verify-coupon', { params: { code, salon } });
    return res.data;
  },

  getActiveCoupons: async () => {
    const res = await apiClient.get<ApiResponse<Coupon[]>>('/coupon/get-active-coupon');
    return res.data;
  },

  getForOnboarding: async () => {
    const res = await apiClient.get<ApiResponse<Coupon[]>>('/coupon/get-coupons-for-on-boarding');
    return res.data;
  },

  // Salon
  addCoupon: async (data: CreateCouponRequest) => {
    const res = await apiClient.post<ApiResponse<Coupon>>('/coupon/add-coupon', data);
    return res.data;
  },

  getCoupons: async (params: { pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Coupon>>>('/coupon/get-coupons', { params });
    return res.data;
  },

  getEnabledCoupons: async () => {
    const res = await apiClient.get<ApiResponse<Coupon[]>>('/coupon/get-coupon-enable-list');
    return res.data;
  },

  deleteCoupon: async (couponId: string) => {
    const res = await apiClient.delete<ApiResponse>('/coupon/delete-coupon', { params: { couponId } });
    return res.data;
  },

  enableDisable: async (couponId: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/coupon/enable-disable-coupon', { enable }, { params: { couponId } });
    return res.data;
  },

  // Admin BookB coupons
  getAdminCoupons: async () => {
    const res = await apiClient.get<ApiResponse<Coupon[]>>('/coupon');
    return res.data;
  },

  createAdminCoupon: async (data: CreateCouponRequest) => {
    const res = await apiClient.post<ApiResponse<Coupon>>('/coupon', data);
    return res.data;
  },

  getAdminCoupon: async (id: string) => {
    const res = await apiClient.get<ApiResponse<Coupon>>(`/coupon/${id}`);
    return res.data;
  },

  updateAdminCoupon: async (id: string, data: Partial<CreateCouponRequest>) => {
    const res = await apiClient.patch<ApiResponse<Coupon>>(`/coupon/${id}`, data);
    return res.data;
  },

  deleteAdminCoupon: async (id: string) => {
    const res = await apiClient.delete<ApiResponse>(`/coupon/${id}`);
    return res.data;
  },
};
