import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getRequest } from './api';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      
      setUser: (userData) => {
        console.log("Setting user in store:", userData);
        set({ user: userData });
      },
      
      logout: () => {
        console.log("Logging out user");
        localStorage.removeItem('token');
        set({ user: null });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ user: null });
          return null;
        }

        try {
          console.log("Checking auth with token");
          const user = await getRequest('/auth/me');
          console.log("Auth check response:", user);
          set({ user });
          return user;
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem('token');
          set({ user: null });
          return null;
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;