import apiClient, { setAuthToken, clearAuthToken } from './client';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  CheckMobileRequest,
  OtpVerificationRequest,
  OtpVerificationResponse,
  UserSignupRequest,
  User,
  ChangeRoleRequest,
  UpdateProfileRequest,
  RewardInfo,
  DynamicFlag,
} from './types';

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await apiClient.post<ApiResponse<LoginResponse>>('/users/login', data);
    return res.data;
  },

  checkMobileNumber: async (data: CheckMobileRequest, packageName: string) => {
    const res = await apiClient.post<ApiResponse<string>>('/users/check-mobile-number', data, {
      params: { packageName },
    });
    return res.data;
  },

  checkSalonMobileNumber: async (data: CheckMobileRequest) => {
    const res = await apiClient.post<ApiResponse<string>>('/users/check-salon-mobile-number', data);
    return res.data;
  },

  verifyOtp: async (data: OtpVerificationRequest) => {
    const res = await apiClient.post<ApiResponse<string>>('/users/otp-verification', data);
    return res.data;
  },

  signup: async (data: UserSignupRequest) => {
    const res = await apiClient.post<ApiResponse<string>>('/users/user-signup-for-mobile', data);
    return res.data;
  },

  getUserByToken: async () => {
    const res = await apiClient.get<ApiResponse<User>>('/users/get-user-by-token');
    return res.data;
  },

  getUserByTokenPost: async (data: { platform: string; deviceInfo: string; deviceId: string }) => {
    const res = await apiClient.post<ApiResponse<User>>('/users/get-user-by-token', data);
    return res.data;
  },

  changeRole: async (data: ChangeRoleRequest) => {
    const res = await apiClient.put<ApiResponse<string>>('/users/change-role', data);
    return res.data;
  },

  forgotPassword: async (data: { email: string; phone: string; role: string }) => {
    const res = await apiClient.patch<ApiResponse>('/users/forgot-password', data);
    return res.data;
  },

  changePassword: async (data: { password: string }) => {
    const res = await apiClient.patch<ApiResponse>('/users/change-password', data);
    return res.data;
  },

  updatePassword: async (data: { oldPassword: string; password: string }) => {
    const res = await apiClient.patch<ApiResponse>('/users/update-password', data);
    return res.data;
  },

  updateProfile: async (data: FormData) => {
    const res = await apiClient.put<ApiResponse<User>>('/users/update-profile', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateProfileImage: async (data: FormData) => {
    const res = await apiClient.patch<ApiResponse>('/users/update-profile-image', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  updateDeviceId: async (data: { userDeviceID: string }) => {
    const res = await apiClient.patch<ApiResponse>('/users/update-device-id', data);
    return res.data;
  },

  logoutUser: async () => {
    const res = await apiClient.patch<ApiResponse>('/users/logout-user');
    await clearAuthToken();
    return res.data;
  },

  deleteAccount: async () => {
    const res = await apiClient.delete<ApiResponse>('/users/removeUser');
    return res.data;
  },

  getRewardInfo: async () => {
    const res = await apiClient.get<ApiResponse<RewardInfo>>('/users/getRewardInfo');
    return res.data;
  },

  getDynamicFlags: async () => {
    const res = await apiClient.get<ApiResponse<DynamicFlag[]>>('/users/getDynamicFlags');
    return res.data;
  },

  getUsers: async (params: { pageNumber: number; pageSize: number; filterValue?: string }) => {
    const res = await apiClient.get<ApiResponse>('/users/get-user', { params });
    return res.data;
  },

  createOrUpdateUser: async (data: Record<string, unknown>) => {
    const res = await apiClient.post<ApiResponse>('/users/user-signup', data);
    return res.data;
  },

  deleteUser: async (userID: string) => {
    const res = await apiClient.delete<ApiResponse>('/users/delete-user', { params: { userID } });
    return res.data;
  },

  enableDisableUser: async (userID: string, enable: boolean) => {
    const res = await apiClient.patch<ApiResponse>('/users/enable-disable-user', { enable }, { params: { userID } });
    return res.data;
  },

  assignStylistToUser: async (stylist: string) => {
    const res = await apiClient.patch<ApiResponse>('/users/assign-stylist-to-user', { stylist });
    return res.data;
  },
};
