import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@changsha/shared';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: (user, token) => set({ user, token }),
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'auth-storage', // 存储在 localStorage 中的 key
    }
  )
);
