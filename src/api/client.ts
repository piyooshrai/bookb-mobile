import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ApiResponse } from './types';

const API_BASE_URL = 'https://bookb.the-algo.com/api/v1';

const TOKEN_KEY = 'bookb_auth_token';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      config.headers.set('token', token);
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse;
    if (data.status === false) {
      const error = new Error(data.message || 'Request failed');
      (error as ApiError).response = data;
      return Promise.reject(error);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const data = error.response.data as ApiResponse;
      const apiError = new Error(data?.message || 'Network error');
      (apiError as ApiError).response = data;
      return Promise.reject(apiError);
    }
    return Promise.reject(error);
  }
);

export interface ApiError extends Error {
  response?: ApiResponse;
}

export async function setAuthToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getAuthToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function clearAuthToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export { TOKEN_KEY };
export default apiClient;
