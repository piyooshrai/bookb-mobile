import apiClient from './client';
import { ApiResponse, Version, PaginatedData } from './types';

export const versionApi = {
  addVersion: async (data: Partial<Version>) => {
    const res = await apiClient.post<ApiResponse<Version>>('/version/add-version', data);
    return res.data;
  },

  getVersions: async (params: { pageNumber: number; pageSize: number }) => {
    const res = await apiClient.get<ApiResponse<PaginatedData<Version>>>('/version/get-version', { params });
    return res.data;
  },

  enableDisable: async (versionId: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/version/enable-disable-version', { enable }, { params: { versionId } });
    return res.data;
  },

  deleteVersion: async (versionId: string) => {
    const res = await apiClient.delete<ApiResponse>('/version/delete-version', { params: { versionId } });
    return res.data;
  },

  getEnabled: async () => {
    const res = await apiClient.get<ApiResponse<Version[]>>('/version/get-enabled-version');
    return res.data;
  },
};
