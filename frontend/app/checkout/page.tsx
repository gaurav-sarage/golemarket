"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "../../store/useCartStore";
import { useAuthStore } from "../../store/useAuthStore";
import api from "../../lib/api";
import { loadRazorpayScript } from "../../lib/razorpay";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Checkout() {
    const { shops, totalPrice, fetchCart, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const router = useRouter();

    const [address, setAddress] = useState({
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "India",
    });
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleCheckout = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load Razorpay popup. Please check your internet connection.");
                return;
            }

            const { data } = await api.post("/orders/checkout", { shippingAddress: address });

            if (!data.success) {
                toast.error("Order creation failed.");
                return;
            }

            const { amount, id: order_id, currency, key } = data.data;

            const options = {
                key,
                amount: amount.toString(),
                currency: currency,
                name: "Gole Market Hub",
                description: "Order Payment",
                order_id: data.data.razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await api.post("/orders/verify-payment", {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            toast.success("Payment successful! Order placed.");
                            clearCart();
                            router.push("/dashboard");
                        } else {
                            toast.error("Payment verification failed.");
                        }
                    } catch (err: any) {
                        toast.error(err.response?.data?.message || "Payment verification failed.");
                    }
                },
                prefill: {
                    name: user?.name || "Customer",
                    email: user?.email || "",
                    contact: "",
                },
                theme: {
                    color: "#3b82f6",
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Checkout failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (shops.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 text-center text-lg text-gray-500">
                <p>Your cart is empty.</p>
                <button onClick={() => router.push("/shops")} className="mt-4 text-primary-600 hover:underline">
                    Go Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
                {/* Left side: Checkout Form */}
                <div className="flex-1">
                    <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-8">Checkout</h2>

                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
                        <h3 className="text-xl font-bold mb-6">Shipping Address</h3>
                        <form onSubmit={handleCheckout} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                    <input
                                        type="text"
                                        name="street"
                                        required
                                        value={address.street}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-gray-300 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        required
                                        value={address.city}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-gray-300 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                    <input
                                        type="text"
                                        name="state"
                                        required
                                        value={address.state}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-gray-300 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                    <input
                                        type="text"
                                        name="zipCode"
                                        required
                                        value={address.zipCode}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 rounded-xl border-gray-300 border bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        required
                                        value={address.country}
                                        onChange={handleChange}
                                        disabled
                                        className="w-full px-4 py-3 rounded-xl border-gray-300 border bg-gray-100 text-gray-500 cursor-not-allowed outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 rounded-xl bg-primary-600 text-white font-bold text-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all shadow-md mt-6 flex justify-center items-center"
                            >
                                {isLoading ? "Processing..." : `Pay ₹${totalPrice}`}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Right side: Order Summary */}
                <div className="w-full lg:w-96 shrink-0">
                    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 sticky top-24">
                        <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                        <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                            {shops.map((shop: any) => (
                                <div key={shop.shopId} className="border-b pb-4 last:border-0 last:pb-0">
                                    <h4 className="font-semibold text-gray-800 mb-3">{shop.shopName || 'Store Items'}</h4>
                                    <ul className="space-y-4">
                                        {shop.items.map((item: any) => (
                                            <li key={item.productId._id} className="flex justify-between items-start gap-4 text-sm">
                                                <div className="flex-1">
                                                    <p className="font-medium text-gray-900">{item.productId.name}</p>
                                                    <p className="text-gray-500 mt-1">Qty: {item.quantity}</p>
                                                </div>
                                                <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-100 pt-6 mt-6">
                            <div className="flex justify-between items-center text-xl font-bold">
                                <span className="text-gray-900">Total</span>
                                <span className="text-primary-600">₹{totalPrice}</span>
                            </div>
                            <p className="text-sm text-gray-500 text-right mt-2">Includes all taxes and fees</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
