import { create } from 'zustand';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

interface AppState {
  // Cart
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartCount: () => number;

  // Notifications
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
  incrementNotificationCount: () => void;

  // Online users
  onlineUsers: Array<{
    user: string;
    stylist: string;
    socketId: string;
    role: string;
    salon: string;
  }>;
  setOnlineUsers: (users: AppState['onlineUsers']) => void;

  // UI state
  selectedDate: string | null;
  setSelectedDate: (date: string | null) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Cart
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.productId === item.productId);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.productId === item.productId ? { ...c, quantity: c.quantity + 1 } : c
          ),
        };
      }
      return { cart: [...state.cart, { ...item, quantity: 1 }] };
    }),
  removeFromCart: (productId) =>
    set((state) => ({
      cart: state.cart.filter((c) => c.productId !== productId),
    })),
  updateCartQuantity: (productId, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { cart: state.cart.filter((c) => c.productId !== productId) };
      }
      return {
        cart: state.cart.map((c) => (c.productId === productId ? { ...c, quantity } : c)),
      };
    }),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
  getCartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),

  // Notifications
  unreadNotificationCount: 0,
  setUnreadNotificationCount: (count) => set({ unreadNotificationCount: count }),
  incrementNotificationCount: () =>
    set((state) => ({ unreadNotificationCount: state.unreadNotificationCount + 1 })),

  // Online users
  onlineUsers: [],
  setOnlineUsers: (onlineUsers) => set({ onlineUsers }),

  // UI state
  selectedDate: null,
  setSelectedDate: (selectedDate) => set({ selectedDate }),
}));
