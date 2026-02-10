import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { User, UserRole } from '@/api/types';
import { TOKEN_KEY } from '@/api/client';

interface AuthState {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  salonId: string | null;
  stylistId: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isFirstLogin: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRole: (role: UserRole) => void;
  setSalonId: (salonId: string) => void;
  setStylistId: (stylistId: string) => void;
  setIsFirstLogin: (isFirst: boolean) => void;
  login: (params: { user: User; token: string; role: UserRole; isFirstLogin?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<string | null>;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  role: null,
  salonId: null,
  stylistId: null,
  isAuthenticated: false,
  isLoading: true,
  isFirstLogin: false,

  setUser: (user) => {
    const salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || null;
    const stylistId = typeof user.stylist === 'string' ? user.stylist : user.stylist?._id || null;
    set({ user, salonId, stylistId });
  },

  setToken: (token) => set({ token }),

  setRole: (role) => set({ role }),

  setSalonId: (salonId) => set({ salonId }),

  setStylistId: (stylistId) => set({ stylistId }),

  setIsFirstLogin: (isFirstLogin) => set({ isFirstLogin }),

  login: async ({ user, token, role, isFirstLogin = false }) => {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    const salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || null;
    const stylistId = typeof user.stylist === 'string' ? user.stylist : user.stylist?._id || null;
    set({
      user,
      token,
      role,
      salonId,
      stylistId,
      isAuthenticated: true,
      isLoading: false,
      isFirstLogin,
    });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    set({
      user: null,
      token: null,
      role: null,
      salonId: null,
      stylistId: null,
      isAuthenticated: false,
      isLoading: false,
      isFirstLogin: false,
    });
  },

  restoreSession: async () => {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (token) {
      set({ token, isLoading: true });
    } else {
      set({ isLoading: false });
    }
    return token;
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
