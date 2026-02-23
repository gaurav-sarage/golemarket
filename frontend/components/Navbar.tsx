"use client";

import Link from "next/link";
import { Store, ShoppingCart, Search, User, LogOut, Package, Menu, X, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CartDrawer from "./CartDrawer";
import { useAuthStore } from "../store/useAuthStore";
import { useCartStore } from "../store/useCartStore";

export default function Navbar() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { user, isAuthenticated, logout, checkAuth } = useAuthStore();
    const { shops, fetchCart } = useCartStore();
    const pathname = usePathname();
    const [isMerchantDomain, setIsMerchantDomain] = useState(false);

    useEffect(() => {
        setIsMerchantDomain(window.location.hostname.startsWith('merchant-') || window.location.hostname.startsWith('merchant.'));
    }, []);

    const isSellerPath = pathname?.startsWith('/seller') || isMerchantDomain;

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
            <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100 shadow-sm transition-all">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 sm:h-20 lg:h-24 transition-all">

                        {/* Logo - Left */}
                        <div className="flex-shrink-0 flex items-center">
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="p-2 sm:p-2.5 bg-primary-100 rounded-xl lg:rounded-2xl group-hover:scale-105 transition-transform duration-300">
                                    <Store className="h-6 w-6 sm:h-7 sm:w-7 text-primary-600" />
                                </div>
                                <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tight text-gray-900 group-hover:text-primary-600 transition-colors">
                                    GoleCentral
                                </span>
                            </Link>
                        </div>

                        {/* Search Bar - Center (Desktop) */}
                        <div className="hidden lg:flex flex-1 justify-center px-8 lg:px-12">
                            <div className="w-full max-w-xl relative group">
                                <input
                                    type="text"
                                    placeholder="Search products, shops, or categories..."
                                    className="w-full pl-12 pr-4 py-3 sm:py-3.5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm hover:border-gray-200"
                                />
                                <Search className="absolute left-4 top-3.5 h-6 w-6 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                            </div>
                        </div>

                        {/* Actions - Right (Desktop & Tablet) */}
                        <div className="hidden md:flex items-center justify-end gap-3 lg:gap-4 flex-shrink-0">
                            {!isSellerPath && user?.role !== 'shop_owner' && user?.role !== 'admin' && (
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-3 text-gray-600 hover:text-primary-600 bg-white hover:bg-primary-50 active:scale-95 rounded-2xl transition-all border-2 border-gray-100 shadow-sm hover:border-primary-100"
                                >
                                    <ShoppingCart className="h-6 w-6" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm ring-2 ring-red-50">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </button>
                            )}

                            {isAuthenticated ? (
                                <div className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-4 border-l-2 border-gray-100">
                                    <div className="flex flex-col items-end">
                                        <span className="text-sm font-bold text-gray-900">
                                            {user?.name.split(' ')[0]}
                                        </span>
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                                            {user?.role.replace('_', ' ')}
                                        </span>
                                    </div>

                                    {user?.role === 'customer' ? (
                                        <Link href="/dashboard" title="My Account" className="flex items-center gap-2 text-primary-700 bg-primary-50 hover:bg-primary-100 border border-primary-100 shadow-sm px-4 py-2.5 rounded-2xl transition-all active:scale-95 font-bold">
                                            <Package className="h-5 w-5" />
                                            <span className="hidden lg:inline text-sm">Dashboard</span>
                                        </Link>
                                    ) : (
                                        <Link href="/seller/dashboard" className="text-base font-bold text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-500/20 px-6 py-3 rounded-2xl transition-all active:scale-95">
                                            Dashboard
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => logout()}
                                        title="Logout"
                                        className="flex items-center gap-2 px-4 py-3 text-red-500 font-bold bg-white border-2 border-gray-100 shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-100 rounded-2xl transition-all active:scale-95"
                                    >
                                        <LogOut className="h-5 w-5" />
                                        <span className="hidden lg:inline text-sm">Sign out</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3 lg:gap-4 pl-3 lg:pl-4 border-l-2 border-gray-100">
                                    <Link href={isSellerPath ? "/seller/login" : "/login"} className="flex items-center gap-2 text-gray-600 hover:text-primary-600 font-bold px-5 py-3 rounded-2xl hover:bg-primary-50 transition-all active:scale-95 border-2 border-transparent hover:border-primary-100">
                                        Sign In
                                    </Link>
                                    <Link href={isSellerPath ? "/seller/register" : "/register"} className="flex items-center gap-2 text-white bg-gray-900 hover:bg-gray-800 font-bold px-6 py-3 rounded-2xl transition-all hover:shadow-lg active:scale-95">
                                        Sign Up
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Toggle button */}
                        <div className="flex md:hidden items-center gap-4">
                            {!isSellerPath && user?.role !== 'shop_owner' && user?.role !== 'admin' && (
                                <button
                                    onClick={() => setIsCartOpen(true)}
                                    className="relative p-2 text-gray-600 bg-gray-50 rounded-xl border border-gray-100"
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {cartItemCount > 0 && (
                                        <span className="absolute -top-1.5 -right-1.5 h-5 w-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                            {cartItemCount}
                                        </span>
                                    )}
                                </button>
                            )}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 bg-gray-50 rounded-xl border border-gray-100 text-gray-600"
                            >
                                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Search Bar Stacked Expansion */}
                <div className="lg:hidden px-4 pb-4 px-max">
                    <div className="w-full relative group">
                        <input
                            type="text"
                            placeholder="Search products or shops..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-gray-900 placeholder-gray-400"
                        />
                        <Search className="absolute left-3.5 top-3 h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                    </div>
                </div>

                {/* Mobile Slide-out/Dropdown Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-100 bg-white">
                        <div className="px-4 pt-4 pb-6 space-y-4 shadow-inner">
                            {isAuthenticated ? (
                                <div className="space-y-4">
                                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-4">
                                        <div className="h-12 w-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-lg font-bold">
                                            {user?.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{user?.name}</p>
                                            <p className="text-xs font-bold text-gray-500 uppercase">{user?.role.replace('_', ' ')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {user?.role === 'customer' ? (
                                            <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 rounded-xl font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all">
                                                <Package className="w-5 h-5" /> Dashboard
                                            </Link>
                                        ) : (
                                            <Link href="/seller/dashboard" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 bg-primary-600 border border-primary-600 rounded-xl font-bold text-white hover:bg-primary-700 active:scale-95 transition-all">
                                                <Store className="w-5 h-5" /> Dashboard
                                            </Link>
                                        )}
                                        <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="flex items-center justify-center gap-2 p-3 bg-white border border-red-200 rounded-xl font-bold text-red-600 hover:bg-red-50 active:scale-95 transition-all">
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    <Link href={isSellerPath ? "/seller/login" : "/login"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-white border-2 border-gray-200 rounded-xl sm:rounded-2xl font-bold text-gray-700 hover:bg-gray-50 active:scale-95 transition-all">
                                        <User className="w-5 h-5" /> Sign In
                                    </Link>
                                    <Link href={isSellerPath ? "/seller/register" : "/register"} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-gray-900 border-2 border-gray-900 rounded-xl sm:rounded-2xl font-bold text-white hover:bg-gray-800 active:scale-95 transition-all">
                                        <ArrowRight className="w-5 h-5" /> Sign Up
                                    </Link>
                                    {!isSellerPath && (
                                        <Link href="/seller/register" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center gap-2 p-3 sm:p-4 bg-primary-50 border-2 border-primary-100 rounded-xl sm:rounded-2xl font-bold text-primary-700 hover:bg-primary-100 active:scale-95 transition-all">
                                            <Store className="w-5 h-5" /> Open a Shop
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
}
