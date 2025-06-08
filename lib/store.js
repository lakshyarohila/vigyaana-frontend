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
        set({ user: userData, isLoading: false });
      },
      
      logout: () => {
        console.log("Logging out user");
        localStorage.removeItem('token');
        set({ user: null, isLoading: false });
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token');
        if (!token) {
          set({ user: null, isLoading: false });
          return;
        }

        set({ isLoading: true });
        try {
          console.log("Checking auth with token:", token);
          const user = await getRequest('/auth/me');
          console.log("Auth check response:", user);
          set({ user, isLoading: false });
          return user;
        } catch (err) {
          console.error("Auth check failed:", err);
          localStorage.removeItem('token');
          set({ user: null, isLoading: false });
          throw err;
        }
      },

      // Initialize auth on app start
      initAuth: async () => {
        const token = localStorage.getItem('token');
        if (token) {
          try {
            await get().checkAuth();
          } catch (err) {
            console.log("Initial auth check failed");
          }
        }
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }), // Only persist user data
    }
  )
);

export default useAuthStore;