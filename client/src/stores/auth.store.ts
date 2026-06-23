import { create } from "zustand";
import { authApi } from "../api/auth.api";
import type { User, LoginPayload, RegisterPayload } from "../types/user.types";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true, // starts true to check auth status on mount
  error: null,

  login: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.login(payload);
      // Wait for checkAuth to finish because the login response itself is missing isAdmin status
      await get().checkAuth();
    } catch (err: any) {
      set({ error: err.message || "Login failed", isLoading: false });
      throw err;
    }
  },

  register: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.register(payload);
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || "Registration failed", isLoading: false });
      throw err;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await authApi.logout();
    } catch (err: any) {
      console.error("Logout error", err);
    } finally {
      set({ user: null, isLoading: false });
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await authApi.getCurrentUser();
      set({ user: res.data.data, isLoading: false });
    } catch (err: any) {
      // 401 Unauthorized is expected if user has not logged in
      set({ user: null, isLoading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
