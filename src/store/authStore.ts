import { create } from 'zustand';
import { api } from '../lib/api';
import type { Profile } from '../types/database';

interface AuthState {
  user: any;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  loading: true,
  
  signIn: async (email: string, password: string) => {
    const response = await api.auth.login(email, password);
    // Guardar el token en localStorage
    localStorage.setItem('access_token', response.access_token);
    // Guardar el usuario en el estado
    const user = {
      id: response.user.id,
      email: response.user.email,
      full_name: response.user.full_name
    };
    set({ 
      user,
      profile: {
        id: response.user.id,
        email: response.user.email,
        full_name: response.user.full_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  },

  signUp: async (email: string, password: string, fullName: string) => {
    await api.auth.register(email, password, fullName);
  },

  signOut: async () => {
    try {
      await api.auth.logout();
    } finally {
      localStorage.removeItem('access_token');
      set({ user: null, profile: null });
    }
  },

  loadUser: async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        set({ user: null, profile: null, loading: false });
        return;
      }

      const profile = await api.auth.getCurrentUser();
      if (!profile) {
        throw new Error('No se pudo obtener el perfil del usuario');
      }

      const user = {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name
      };

      set({ user, profile, loading: false });
    } catch (error) {
      console.error('Error loading user:', error);
      localStorage.removeItem('access_token');
      set({ user: null, profile: null, loading: false });
    }
  },
}));