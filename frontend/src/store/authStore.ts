import { create } from "zustand";
import { User, Tokens } from "../types";
import { getToken, setToken, removeTokens } from "../lib/storage";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setTokens: (tokens: Tokens) => Promise<void>;
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setTokens: async (tokens) => {
    await setToken(tokens.accessToken);
    await setToken(tokens.refreshToken, "refreshToken");
    set({ isAuthenticated: true });
  },
  initialize: async () => {
    try {
      set({ isLoading: true });
      const token = await getToken();
      
      set({ isAuthenticated: !!token });
    } finally {
      set({ isLoading: false });
    }
  },
  logout: async () => {
    await removeTokens();
    set({ user: null, isAuthenticated: false });
  },
})); 