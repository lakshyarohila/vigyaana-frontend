import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRequest } from './api';
import { signOut } from 'next-auth/react';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,

      setUser: (userData) => {
        console.log('Setting user in store:', userData);
        set({ user: userData });
      },

      logout: async () => {
        console.log('Logging out user');
        try {
          // Sign out from NextAuth (Google session)
          await signOut({ redirect: false });
          
          await fetch('https://vigyaana-server.onrender.com/api/auth/logout', {
            method: 'POST',
            credentials: 'include', // 🟢 clear cookie
          });
        } catch (err) {
          console.error('Logout failed:', err);
        }
        set({ user: null });
      },

      checkAuth: async () => {
        try {
          set({ isLoading: true });
          const user = await getRequest('/auth/me', { withCredentials: true });
          console.log('Authenticated user:', user);
          set({ user });
          return user;
        } catch (err) {
          console.error('Auth check failed:', err);
          set({ user: null });
          return null;
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;