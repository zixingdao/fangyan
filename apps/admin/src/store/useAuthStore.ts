import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@changsha/shared';
import { api } from '../lib/axios';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (credentials: any) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (credentials) => {
        const response: any = await api.post('/auth/login', credentials);
        // Verify admin role
        if (response.user.role !== UserRole.ADMIN && response.user.role !== UserRole.SUPER_ADMIN) {
            throw new Error('非管理员账号禁止访问');
        }
        set({ user: response.user, token: response.access_token });
      },
      logout: () => set({ user: null, token: null }),
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);
