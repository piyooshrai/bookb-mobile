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
  isDemo: boolean;

  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setRole: (role: UserRole) => void;
  setSalonId: (salonId: string) => void;
  setStylistId: (stylistId: string) => void;
  setIsFirstLogin: (isFirst: boolean) => void;
  login: (params: { user: User; token: string; role: UserRole; isFirstLogin?: boolean }) => Promise<void>;
  demoLogin: (role: UserRole) => void;
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
  isDemo: false,

  setUser: (user) => {
    let salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || null;
    if (!salonId && user.role === 'salon') salonId = user._id;
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
    let salonId = typeof user.salon === 'string' ? user.salon : user.salon?._id || null;
    // For salon role, the user's own _id IS the salon ID
    if (!salonId && role === 'salon') salonId = user._id;
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

  demoLogin: (role: UserRole) => {
    const demoUser: User = {
      _id: 'demo_user_001',
      name: 'Demo User',
      email: 'demo@bookb.app',
      userName: 'demo',
      phone: '5551234567',
      address: '123 Demo Street',
      photo: '',
      photoKey: '',
      photoDark: '',
      photoKeyDark: '',
      role,
      stylistCount: role === 'salon' ? 5 : 0,
      salon: role === 'salon' || role === 'stylist' ? 'demo_salon_001' : '',
      stylist: role === 'stylist' ? 'demo_stylist_001' : '',
      passwordChangedAt: '',
      active: true,
      gender: 'other' as const,
      age: 30,
      userDeviceID: '',
      dob: '1995-01-01',
      appMenu: {},
      packageName: 'com.bookb.app',
      appID: '',
      isSpecialApp: false,
      webUrl: '',
      services: [],
      startTime: '09:00',
      endTime: '18:00',
      lunchStartTime: '12:00',
      lunchEndTime: '13:00',
      recurringType: 'week' as const,
      intervalTime: '30',
      isBreakTimeCompulsory: false,
      clientNote: '',
      shippingAddress: {},
      billingAddress: {},
      maxCalendar: 30,
      subscription: [],
      cancel_at_period_end: false,
      platform: 'android' as const,
      deviceInfo: '',
      deviceId: '',
      accessToken: '',
      description: 'Demo account',
      userNote: '',
      countryCode: '+44',
      currency: 'GBP',
      availableRole: [role],
      isMultiRole: false,
      addedFrom: 'dashboard' as const,
      referralCode: '',
      referredBy: '',
      coins: 100,
      isFirstLogin: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set({
      user: demoUser,
      token: 'demo_token',
      role,
      salonId: role === 'salon' || role === 'stylist' ? 'demo_salon_001' : null,
      stylistId: role === 'stylist' ? 'demo_stylist_001' : null,
      isAuthenticated: true,
      isLoading: false,
      isFirstLogin: false,
      isDemo: true,
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
      isDemo: false,
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
