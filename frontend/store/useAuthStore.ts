import { create } from 'zustand';
import api from '../lib/api';
import { useCartStore } from './useCartStore';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'shop_owner' | 'admin';
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (userData: User) => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    login: (userData) => set({ user: userData, isAuthenticated: true }),
    logout: async () => {
        try {
            await api.get('/auth/logout');
            set({ user: null, isAuthenticated: false });
            useCartStore.getState().clearCart();
            if (typeof window !== 'undefined') {
                window.location.href = '/';
            }
        } catch (err) {
            console.error('Logout failed', err);
        }
    },
    checkAuth: async () => {
        try {
            const { data } = await api.get('/auth/me');
            if (data.success) {
                set({ user: data.data, isAuthenticated: true, isLoading: false });
                if (data.data.role === 'customer') {
                    useCartStore.getState().fetchCart();
                }
            } else {
                set({ user: null, isAuthenticated: false, isLoading: false });
                useCartStore.getState().clearCart();
            }
        } catch (err) {
            set({ user: null, isAuthenticated: false, isLoading: false });
            useCartStore.getState().clearCart();
        }
    },
}));
