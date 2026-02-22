"use client";

import Link from "next/link";
import { Store, ShoppingCart, Search, User, LogOut, Package } from "lucide-react";
import { useState, useEffect } from "react";
import CartDrawer from "./CartDrawer";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

export default function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
    const { shops, fetchCart } = useCartStore();

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'customer') {
            fetchCart();
        }
    }, [isAuthenticated, user, fetchCart]);

    const cartItemCount = shops.reduce((total, shop) => total + shop.items.reduce((sum, item) => sum + item.quantity, 0), 0);

    return (
        <>
            <nav className="fixed top-0 w-full glass z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Store className="h-8 w-8 text-primary-600" />
                            <span className="font-heading font-bold text-xl tracking-tight text-gray-900">
                                Gole Market Hub
                            </span>
                        </Link>

                        <div className="hidden md:flex flex-1 max-w-lg mx-8">
                            <div className="relative w-full text-gray-800">
                                <input
                                    type="text"
                                    placeholder="Search products or shops..."
                                    className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all bg-white/50"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {user?.role !== 'shop_owner' && user?.role !== 'admin' && (
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-full transition-colors"
                                >
                                    <ShoppingCart className="h-6 w-6" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {isAuthenticated ? (
                                <div className="flex items-center gap-4 ml-2">
                                    <span className="hidden sm:block text-sm font-medium text-gray-600">
                                        Hi, {user?.name.split(' ')[0]}
                                    </span>

                                    {user?.role === 'customer' ? (
                                        <Link href="/dashboard" title="My Orders" className="text-gray-600 hover:text-primary-600 bg-gray-50 hover:bg-primary-50 p-2 rounded-full transition-colors">
                                            <Package className="h-5 w-5" />
                                        </Link>
                                    ) : (
                                        <Link href="/seller/dashboard" className="text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-full transition-colors">
                                            Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => logout()}
                                        title="Logout"
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 ml-2">
                                    <Link href="/login" className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-medium px-3 py-2 rounded-lg hover:bg-primary-50 transition-colors">
                                        <User className="h-5 w-5" />
                                        <span className="hidden sm:block">Sign In</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
