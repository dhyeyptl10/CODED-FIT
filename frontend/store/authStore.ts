import { create } from 'zustand';
import { User, FitProfile } from '@coded-fit/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  loginMode: 'otp' | 'email';
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  openLoginModal: (mode?: 'otp' | 'email') => void;
  closeLoginModal: () => void;
  updateFitProfile: (profile: FitProfile) => void;
  toggleWishlist: (productId: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoginModalOpen: false,
  loginMode: 'otp',

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('coded_token', token);
      localStorage.setItem('coded_user', JSON.stringify(user));
    }
    set({ user, token, isAuthenticated: true, isLoginModalOpen: false });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('coded_token');
      localStorage.removeItem('coded_user');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },

  openLoginModal: (mode = 'otp') => set({ isLoginModalOpen: true, loginMode: mode }),
  closeLoginModal: () => set({ isLoginModalOpen: false }),

  updateFitProfile: (profile) =>
    set((state) => ({
      user: state.user ? { ...state.user, fitProfile: profile } : null
    })),

  toggleWishlist: (productId) =>
    set((state) => {
      if (!state.user) return state;
      const wishlist = state.user.wishlist || [];
      const exists = wishlist.includes(productId);
      const updated = exists
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId];
      return { user: { ...state.user, wishlist: updated } };
    })
}));
