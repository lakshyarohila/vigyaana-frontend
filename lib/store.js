import { create } from 'zustand';
import { getRequest } from './api';

const useAuthStore = create((set) => ({
  user: null,
  setUser: (userData) => set({ user: userData }),
  logout: () => set({ user: null }),

  checkAuth: async () => {
    try {
      const user = await getRequest('/auth/me');
      set({ user });
    } catch (err) {
      set({ user: null });
    }
  },
}));

export default useAuthStore;
