import apiClient from './client';
import { ApiResponse, Service, ServiceGroup, CreateServiceRequest, RankUpdateRequest, PaginatedData } from './types';

export const servicesApi = {
  getGroupedByCategory: async (name: string) => {
    const res = await apiClient.get<ApiResponse<ServiceGroup[]>>('/service/get-website-service-groupby-category', { params: { name } });
    return res.data;
  },

  getGroupedByCategorySalon: async (salon: string) => {
    const res = await apiClient.get<ApiResponse<ServiceGroup[]>>('/service/get-website-service-groupby-category-salon', { params: { salon } });
    return res.data;
  },

  addService: async (data: CreateServiceRequest) => {
    const res = await apiClient.post<ApiResponse<Service>>('/service/add-service', data);
    return res.data;
  },

  getMainServices: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Service>>>('/service/get-main-service', { params });
    return res.data;
  },

  getSubServices: async (params: { pageNumber: number; pageSize: number; filterValue?: string; mainServiceId: string }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Service>>>('/service/get-sub-service', { params });
    return res.data;
  },

  getEnabledMainServices: async () => {
    const res = await apiClient.get<ApiResponse<Service[]>>('/service/get-enable-main-service');
    return res.data;
  },

  enableDisable: async (serviceId: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/service/enable-disable-service', { enable }, { params: { serviceId } });
    return res.data;
  },

  deleteService: async (serviceId: string) => {
    const res = await apiClient.delete<ApiResponse>('/service/delete-service', { params: { serviceId } });
    return res.data;
  },

  getEnabledSubServices: async (mainServiceId: string) => {
    const res = await apiClient.get<ApiResponse<Service[]>>('/service/get-enable-sub-service', { params: { mainServiceId } });
    return res.data;
  },

  getGrouped: async () => {
    const res = await apiClient.get<ApiResponse<ServiceGroup[]>>('/service/get-service-groupby-category');
    return res.data;
  },

  rankUpdate: async (data: RankUpdateRequest) => {
    const res = await apiClient.patch<ApiResponse>('/service/rank-update-service', data);
    return res.data;
  },
};
