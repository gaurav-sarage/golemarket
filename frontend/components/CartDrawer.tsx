"use client";

import { X, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "../store/useCartStore";

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const { shops, totalPrice, removeFromCart, isLoading } = useCartStore();

    if (!isOpen) return null;

    return (
        <>
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300"
                onClick={onClose}
            />
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-[60] transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
            >
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-heading font-bold">Your Cart</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="h-6 w-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {shops.length === 0 ? (
                        <div className="text-center text-gray-500 mt-20">
                            <p>Your cart is empty.</p>
                        </div>
                    ) : (
                        shops.map((shop: any) => (
                            <div key={shop.shopId} className="space-y-4">
                                <h3 className="font-bold text-lg text-gray-800 border-b pb-2">Store Items</h3>
                                {shop.items.map((item: any) => (
                                    <div key={item.productId._id} className="flex gap-4 items-center">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                            <img
                                                src={item.productId.images?.[0] || "https://via.placeholder.com/80"}
                                                alt={item.productId.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 leading-tight">{item.productId.name}</h4>
                                            <div className="mt-1 flex justify-between items-center">
                                                <span className="font-medium text-primary-600">₹{item.price} x {item.quantity}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.productId._id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                    disabled={isLoading}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>

                {shops.length > 0 && (
                    <div className="border-t p-6 bg-gray-50">
                        <div className="flex justify-between font-bold text-xl mb-6">
                            <span>Total</span>
                            <span className="text-primary-600">₹{totalPrice}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={onClose}
                            className="w-full flex justify-center py-4 px-4 rounded-xl shadow-lg bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 hover:shadow-xl transition-all"
                        >
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
