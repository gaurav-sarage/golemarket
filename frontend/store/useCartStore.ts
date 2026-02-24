import { create } from 'zustand';
import api from '../lib/api';

interface CartItem {
    productId: { _id: string; name: string; images?: string[] };
    quantity: number;
    price: number;
}

interface ShopCart {
    shopId: string;
    shopName?: string;
    items: CartItem[];
}

interface CartState {
    shops: ShopCart[];
    totalPrice: number;
    isLoading: boolean;
    fetchCart: () => Promise<void>;
    addToCart: (productId: string, quantity: number, force?: boolean) => Promise<any>;
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

    addToCart: async (productId: string, quantity: number, force: boolean = false) => {
        try {
            set({ isLoading: true });
            const { data } = await api.post('/cart/add', { productId, quantity, force });
            if (data.success) {
                set({ shops: data.data.shops, totalPrice: data.data.totalPrice, isLoading: false });
                return { success: true };
            }
            return data;
        } catch (err: any) {
            set({ isLoading: false });
            return err.response?.data || { success: false, message: 'Failed to add to cart' };
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
