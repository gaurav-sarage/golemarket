import { create } from 'zustand';
import api from '../lib/api';

interface CartItem {
    productId: { _id: string; name: string; images?: string[] };
    quantity: number;
    price: number;
}

interface ShopCart {
    shopId: string;
    items: CartItem[];
}

interface CartState {
    shops: ShopCart[];
    totalPrice: number;
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number) => Promise<boolean>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    shops: [],
    totalPrice: 0,
    isLoading: true,

    fetchCart: async () => {
        try {
            const { data } = await api.get('/cart');
            if (data.success) {
                set({ shops: data.data.shops, totalPrice: data.data.totalPrice, isLoading: false });
            } else {
                set({ shops: [], totalPrice: 0, isLoading: false });
            }
        } catch (err) {
            set({ isLoading: false });
        }
    },

    addToCart: async (productId: string, quantity: number) => {
        try {
            set({ isLoading: true });
            const { data } = await api.post('/cart/add', { productId, quantity });
            if (data.success) {
                set({ shops: data.data.shops, totalPrice: data.data.totalPrice, isLoading: false });
                return true;
            }
            return false;
        } catch (err) {
            set({ isLoading: false });
            return false;
        }
    },

    removeFromCart: async (productId: string) => {
        try {
            set({ isLoading: true });
            const { data } = await api.delete(`/cart/remove/${productId}`);
            if (data.success) {
                set({ shops: data.data.shops, totalPrice: data.data.totalPrice, isLoading: false });
            }
        } catch (err) {
            set({ isLoading: false });
        }
    },

    clearCart: () => set({ shops: [], totalPrice: 0 }),
}));
