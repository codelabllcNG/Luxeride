import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { UserInfo } from '../types/auth';
import { shallow } from 'zustand/shallow';



interface AuthState {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  updateUser: (data: Partial<UserInfo>) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null, 
      setUser: (user) => set({ user }),
      
      updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : state.user,
    })),

      clearUser: () => set({ user: null }),
    }),
   
    {
      name: 'user', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);