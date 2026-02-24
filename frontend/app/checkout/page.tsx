"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { loadRazorpayScript } from "@/lib/razorpay";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronLeft, CreditCard, ShieldCheck } from "lucide-react";

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

    // Enforce single-shop logic by only taking the first shop's items
    const activeShop = shops[0];

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
        <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-bold mb-8 transition-all group"
                >
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Checkout Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1"
                    >
                        <h1 className="text-4xl font-heading font-black text-gray-900 mb-2">Checkout</h1>
                        <p className="text-gray-500 mb-8 font-medium">Complete your order from <span className="text-gray-900 font-bold">{activeShop?.shopName || 'Store'}</span></p>

                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sm:p-10 mb-8">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                                    <ShoppingBag className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                                    <p className="text-sm font-medium text-gray-500">{activeShop?.items.length} items from this store</p>
                                </div>
                            </div>

                            <div className="space-y-6 mb-10">
                                {activeShop?.items.map((item: any) => (
                                    <div key={item.productId._id} className="flex gap-4 items-center">
                                        <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                            <img
                                                src={item.productId.images?.[0] || "https://via.placeholder.com/150"}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-gray-900">{item.productId.name}</h4>
                                            <p className="text-sm font-bold text-gray-400">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-gray-900">₹{item.price * item.quantity}</p>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">₹{item.price} each</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-6 bg-gray-50 rounded-[1.8rem] space-y-4">
                                <div className="flex justify-between text-sm font-bold text-gray-500">
                                    <span>Subtotal</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-sm font-bold text-gray-500">
                                    <span>Store Service Fee</span>
                                    <span className="text-green-600">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                    <span className="text-lg font-black text-gray-900">Total Amount</span>
                                    <span className="text-3xl font-black text-primary-600">₹{totalPrice}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right: Payment Action */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="w-full lg:w-[380px] shrink-0"
                    >
                        <div className="bg-white rounded-[2.5rem] border-2 border-primary-100 shadow-xl shadow-primary-500/5 p-8 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-primary-600" />
                                Payment
                            </h3>

                            <div className="space-y-4 mb-8 text-sm font-medium text-gray-600 leading-relaxed">
                                <div className="flex gap-3">
                                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                    <p>Secure SSL Encrypted Payment</p>
                                </div>
                                <div className="flex gap-3">
                                    <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                                    <p>Direct Store Settlement</p>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={isLoading}
                                className="w-full py-5 rounded-[1.8rem] bg-primary-600 text-white font-black text-xl hover:bg-primary-700 active:scale-95 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50 disabled:active:scale-100 mb-6"
                            >
                                {isLoading ? "Processing..." : `Pay ₹${totalPrice}`}
                            </button>

                            <p className="text-[11px] font-bold text-gray-400 text-center uppercase tracking-widest leading-loose">
                                By clicking Pay, you agree to our <br />
                                <span className="text-gray-900 underline decoration-primary-500/30">Terms and Conditions</span>
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
