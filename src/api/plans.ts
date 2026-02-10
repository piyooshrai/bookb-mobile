import apiClient from './client';
import { ApiResponse, SubscriptionPlan, PackagePlan, PaginatedData } from './types';

export const plansApi = {
  getPackages: async () => {
    const res = await apiClient.get<ApiResponse<PackagePlan[]>>('/plan/get-packages');
    return res.data;
  },

  getTotalPrice: async (qty: number, code?: string) => {
    const url = code ? `/plan/total-price/${qty}/${code}` : `/plan/total-price/${qty}`;
    const res = await apiClient.get<ApiResponse>(url);
    return res.data;
  },

  getPlans: async (params: { pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<SubscriptionPlan>>>('/plan/get-subscription-plans', { params });
    return res.data;
  },

  getEnabledPlans: async () => {
    const res = await apiClient.get<ApiResponse<SubscriptionPlan[]>>('/plan/get-subscription-plan-enable-list');
    return res.data;
  },

  deletePlan: async (planId: string) => {
    const res = await apiClient.delete<ApiResponse>('/plan/delete-subscription-plan', { params: { planId } });
    return res.data;
  },

  enableDisable: async (planId: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/plan/enable-disable-subscription-plan', { enable }, { params: { planId } });
    return res.data;
  },

  cancelSubscription: async () => {
    const res = await apiClient.get<ApiResponse>('/plan/cancel-subscription');
    return res.data;
  },

  getSubscriptionDetail: async () => {
    const res = await apiClient.get<ApiResponse>('/plan/get-subscription-detail');
    return res.data;
  },

  createPlan: async (data: Record<string, unknown>) => {
    const res = await apiClient.post<ApiResponse>('/plan/plans/', data);
    return res.data;
  },

  updatePlan: async (id: string, data: Record<string, unknown>) => {
    const res = await apiClient.patch<ApiResponse>(`/plan/plans/${id}`, data);
    return res.data;
  },

  deletePlanById: async (id: string) => {
    const res = await apiClient.delete<ApiResponse>(`/plan/plans/${id}`);
    return res.data;
  },
};
