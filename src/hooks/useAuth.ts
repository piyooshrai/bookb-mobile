import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { setAuthToken } from '@/api/client';
import {
  LoginRequest,
  CheckMobileRequest,
  OtpVerificationRequest,
  UserSignupRequest,
  ChangeRoleRequest,
} from '@/api/types';

export function useLogin() {
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await authApi.login(data);
      if (res.data?.token) {
        await setAuthToken(res.data.token);
        const userRes = await authApi.getUserByToken();
        if (userRes.data) {
          await storeLogin({
            user: userRes.data,
            token: res.data.token,
            role: res.data.role,
            isFirstLogin: res.data.isFirstLogin,
          });
        }
      }
      return res;
    },
  });
}

export function useCheckMobile() {
  return useMutation({
    mutationFn: ({ data, packageName }: { data: CheckMobileRequest; packageName: string }) =>
      authApi.checkMobileNumber(data, packageName),
  });
}

export function useVerifyOtp() {
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async (data: OtpVerificationRequest) => {
      const res = await authApi.verifyOtp(data);
      if (res.data) {
        await setAuthToken(res.data as unknown as string);
        const userRes = await authApi.getUserByToken();
        if (userRes.data) {
          const otpRes = res as unknown as { data: string; role: string; isFirstLogin: boolean };
          await storeLogin({
            user: userRes.data,
            token: otpRes.data,
            role: otpRes.role as 'admin' | 'salon' | 'stylist' | 'user',
            isFirstLogin: otpRes.isFirstLogin,
          });
        }
      }
      return res;
    },
  });
}

export function useSignup() {
  return useMutation({
    mutationFn: (data: UserSignupRequest) => authApi.signup(data),
  });
}

export function useGetUserByToken() {
  const { token, setUser, setRole, setLoading } = useAuthStore();

  return useQuery({
    queryKey: ['user', 'byToken'],
    queryFn: async () => {
      const res = await authApi.getUserByToken();
      if (res.data) {
        setUser(res.data);
        setRole(res.data.role);
      }
      setLoading(false);
      return res.data;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useChangeRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ChangeRoleRequest) => authApi.changeRole(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => authApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });
}

export function useLogout() {
  const { logout: storeLogout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await authApi.logoutUser();
      await storeLogout();
      queryClient.clear();
    },
  });
}

export function useRewardInfo() {
  return useQuery({
    queryKey: ['rewards'],
    queryFn: async () => {
      const res = await authApi.getRewardInfo();
      return res.data;
    },
  });
}

export function useUsers(params: { pageNumber: number; pageSize: number; filterValue?: string }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: async () => {
      const res = await authApi.getUsers(params);
      return res.data;
    },
  });
}
