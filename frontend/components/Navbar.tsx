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
                    <div className="flex justify-between items-center h-16">
                        {/* Logo - Left */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="p-2 bg-primary-100 rounded-xl group-hover:scale-105 transition-transform duration-300">
                                    <Store className="h-6 w-6 text-primary-600" />
                                </div>
                                <span className="font-heading font-extrabold text-xl tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                                    GoleCentral
                                </span>
                            </Link>
                        </div>

                        {/* Search Bar - Center */}
                        <div className="hidden md:flex flex-1 justify-center px-8">
                            <div className="w-full max-w-lg relative group">
                                <input
                                    type="text"
                                    placeholder="Search products, shops, or categories..."
                                    className="w-full pl-12 pr-4 py-2.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-gray-900 placeholder-gray-400"
                                />
                                <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                        </div>

                        {/* Actions - Right */}
                        <div className="flex items-center justify-end gap-3 flex-shrink-0">
                            {user?.role !== 'shop_owner' && user?.role !== 'admin' && (
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2.5 text-gray-600 hover:text-primary-600 bg-white hover:bg-primary-50 active:scale-95 rounded-full transition-all border border-gray-100 shadow-sm"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {isAuthenticated ? (
                                <div className="flex items-center gap-3 pl-2 sm:border-l sm:border-gray-200">
                                    <div className="hidden sm:flex flex-col items-end">
                                        <span className="text-sm font-bold text-gray-900">
                                            {user?.name.split(' ')[0]}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500 capitalize">
                                            {user?.role.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {user?.role === 'customer' ? (
                                        <Link href="/dashboard" title="My Orders" className="text-gray-600 hover:text-primary-600 bg-white hover:bg-primary-50 border border-gray-100 shadow-sm p-2.5 rounded-full transition-all active:scale-95">
                                            <Package className="h-5 w-5" />
                                        </Link>
                                    ) : (
                                        <Link href="/seller/dashboard" className="text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 hover:shadow-md px-4 py-2 rounded-xl transition-all active:scale-95">
                                            Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => logout()}
                                        title="Logout"
                                        className="p-2.5 text-red-500 bg-white border border-gray-100 shadow-sm hover:bg-red-50 hover:text-red-600 rounded-full transition-all active:scale-95"
                                    >
                                        <LogOut className="h-5 w-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 pl-2 sm:border-l sm:border-gray-200">
                                    <Link href="/login" className="flex items-center gap-2 text-gray-700 hover:text-primary-600 font-bold px-4 py-2 rounded-xl hover:bg-primary-50 transition-all active:scale-95">
                                        Sign In
                                    </Link>
                                    <Link href="/register" className="hidden sm:flex items-center gap-2 text-white bg-gray-900 hover:bg-gray-800 font-bold px-4 py-2 rounded-xl transition-all hover:shadow-md active:scale-95">
                                        Sign Up
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
