import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthenticateResponse } from "../api/types";

// User information extracted from auth response
interface User {
  email: string;
  firstName?: string;
  lastName?: string;
  userType?: string;
  storeId?: number;
  storeName?: string;
}

// Authentication state shape
interface AuthState {
  // Auth tokens
  token: string | null;
  refreshToken: string | null;

  // User profile data
  user: User | null;

  // Actions
  setAuth: (payload: AuthenticateResponse) => void;
  logout: () => void;

  // Computed getters
  isAuthenticated: () => boolean;
}

/**
 * Global authentication store using Zustand with localStorage persistence
 *
 * How it works:
 * 1. Stores JWT tokens and user data
 * 2. Persists to localStorage
 * 3. Provides logout function to clear auth state
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      // Initial state
      token: null,
      refreshToken: null,
      user: null,

      // Save auth data from login/refresh response
      setAuth: (response) => {
        set({
          token: response.token,
          refreshToken: response.refreshToken,
          user: {
            email: response.email || "",
            firstName: response.firstName,
            lastName: response.lastName,
            userType: response.userType,
            storeName: response.storeName,
            storeId: response.storeId,
          },
        });
      },

      // Clear all auth data
      logout: () => {
        set({ token: null, refreshToken: null, user: null });
      },

      // Check if user is logged in
      isAuthenticated: () => {
        const state = get();
        return !!state.token && !!state.refreshToken;
      },
    }),
    {
      name: "auth", // localStorage key: "auth"
      // Only persist tokens and user, not functions
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    },
  ),
);
