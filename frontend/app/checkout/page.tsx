"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";
import { loadRazorpayScript } from "@/lib/razorpay";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingBag,
    ChevronLeft,
    CreditCard,
    ShieldCheck,
    CheckCircle2,
    Truck,
    MapPin,
    Phone,
    User,
    Lock,
    ChevronRight,
    ArrowRight,
    Tag
} from "lucide-react";

type CheckoutStep = "SHIPPING" | "REVIEW" | "PAYMENT";

export default function Checkout() {
    const { shops, totalPrice, fetchCart, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const router = useRouter();

    const [currentStep, setCurrentStep] = useState<CheckoutStep>("SHIPPING");
    const [address, setAddress] = useState({
        street: user?.address?.street || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        zipCode: user?.address?.zipCode || "",
        country: "India",
    });
    const [contact, setContact] = useState({
        phone: user?.phone || "",
        email: user?.email || "",
    });
    const [isLoading, setIsLoading] = useState(false);

    // Enforce single-shop logic
    const activeShop = shops[0];

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setContact({ ...contact, [e.target.name]: e.target.value });
    };

    const validateShipping = () => {
        if (!address.street || !address.city || !address.state || !address.zipCode) {
            toast.error("Please fill in all address details");
            return false;
        }
        if (!contact.phone) {
            toast.error("Please provide a contact number");
            return false;
        }
        return true;
    };

    const nextStep = () => {
        if (currentStep === "SHIPPING" && validateShipping()) setCurrentStep("REVIEW");
        else if (currentStep === "REVIEW") setCurrentStep("PAYMENT");
    };

    const prevStep = () => {
        if (currentStep === "REVIEW") setCurrentStep("SHIPPING");
        else if (currentStep === "PAYMENT") setCurrentStep("REVIEW");
    };

    const handleCheckout = async () => {
        setIsLoading(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway. Please try again.");
                return;
            }

            const { data } = await api.post("/orders/checkout", {
                shippingAddress: address,
                phoneNumber: contact.phone
            });

            if (!data.success) {
                toast.error(data.message || "Checkout failed");
                return;
            }

            const { amount, currency, key, razorpayOrderId } = data.data;

            const options = {
                key,
                amount: amount.toString(),
                currency: currency,
                name: "GoleMarket",
                description: `Payment for ${activeShop?.shopName}`,
                image: "/logo.png",
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        const verifyRes = await api.post("/orders/verify-payment", {
                            razorpayOrderId: response.razorpay_order_id,
                            razorpayPaymentId: response.razorpay_payment_id,
                            razorpaySignature: response.razorpay_signature,
                        });

                        if (verifyRes.data.success) {
                            toast.success("Payment successful!");
                            clearCart();
                            router.push("/dashboard");
                        } else {
                            toast.error("Payment verification failed");
                        }
                    } catch (err: any) {
                        toast.error("Payment verification failed");
                    }
                },
                prefill: {
                    name: user?.name,
                    email: contact.email,
                    contact: contact.phone,
                },
                theme: {
                    color: "#2563eb", // primary-600
                },
            };

            const paymentObject = new (window as any).Razorpay(options);
            paymentObject.open();
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Checkout initialization failed");
        } finally {
            setIsLoading(false);
        }
    };

    // Calculation Constants
    const tax = Math.round(totalPrice * 0.05); // 5% GST
    const handlingFee = 15;
    const grandTotal = totalPrice + tax + handlingFee;

    if (shops.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4 text-center">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
                    <ShoppingBag className="w-10 h-10 text-gray-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-500 mb-8">Add components or items from a shop to start checkout.</p>
                <button onClick={() => router.push("/shops")} className="px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all">
                    Browse Marketplace
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-12 pb-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Simplified Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8">
                    <div>
                        <button
                            onClick={() => currentStep === "SHIPPING" ? router.back() : prevStep()}
                            className="flex items-center gap-2 text-gray-400 hover:text-primary-600 font-bold mb-4 transition-all group"
                        >
                            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            {currentStep === "SHIPPING" ? "Return to Cart" : "Go Back"}
                        </button>
                        <h1 className="text-4xl font-heading font-black text-gray-900 tracking-tight">Checkout</h1>
                    </div>

                    {/* Stepper Indicator */}
                    <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
                        <StepIndicator current={currentStep} target="SHIPPING" label="Address" icon={MapPin} />
                        <div className="w-8 h-1 bg-gray-100 rounded-full" />
                        <StepIndicator current={currentStep} target="REVIEW" label="Review" icon={CheckCircle2} />
                        <div className="w-8 h-1 bg-gray-100 rounded-full" />
                        <StepIndicator current={currentStep} target="PAYMENT" label="Payment" icon={CreditCard} />
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side: Form Content */}
                    <div className="flex-1 min-w-0">
                        <AnimatePresence mode="wait">
                            {currentStep === "SHIPPING" && (
                                <motion.div
                                    key="shipping"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    {/* Contact Section */}
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">Contact Information</h3>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    value={contact.phone}
                                                    onChange={handleContactChange}
                                                    placeholder="+91"
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={contact.email}
                                                    onChange={handleContactChange}
                                                    placeholder="your@email.com"
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Section */}
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm">
                                        <div className="flex items-center gap-4 mb-8">
                                            <div className="w-12 h-12 rounded-2xl bg-green-50 flex items-center justify-center text-green-600">
                                                <MapPin className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900">Service Address</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">Street / House No.</label>
                                                <input
                                                    type="text"
                                                    name="street"
                                                    value={address.street}
                                                    onChange={handleAddressChange}
                                                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">City</label>
                                                    <input
                                                        type="text"
                                                        name="city"
                                                        value={address.city}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2 ml-1">ZIP Code</label>
                                                    <input
                                                        type="text"
                                                        name="zipCode"
                                                        value={address.zipCode}
                                                        onChange={handleAddressChange}
                                                        className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-500/20 focus:ring-4 focus:ring-primary-500/5 transition-all outline-none font-bold"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={nextStep}
                                        className="w-full py-5 rounded-[1.8rem] bg-gray-900 text-white font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
                                    >
                                        Continue to Review <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === "REVIEW" && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    {/* Order Items Review */}
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-sm">
                                        <div className="flex justify-between items-center mb-10">
                                            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                                                <ShoppingBag className="w-6 h-6 text-primary-600" />
                                                Review Items
                                            </h3>
                                            <span className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-black uppercase text-gray-500 tracking-wider">
                                                {activeShop?.items.length} Items
                                            </span>
                                        </div>

                                        <div className="space-y-6">
                                            {activeShop?.items.map((item: any) => (
                                                <div key={item.productId._id} className="flex gap-6 items-center">
                                                    <div className="w-24 h-24 rounded-3xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0">
                                                        <img
                                                            src={item.productId.images?.[0] || "https://via.placeholder.com/150"}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-lg text-gray-900 mb-1">{item.productId.name}</h4>
                                                        <p className="text-sm font-bold text-gray-400 mb-2">Quantity: {item.quantity}</p>
                                                        <p className="font-black text-primary-600">₹{item.price * item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-gray-100 flex items-center gap-4 text-sm font-medium text-gray-500">
                                            <Truck className="w-5 h-5" />
                                            <span>Ordering from <span className="text-gray-900 font-bold">{activeShop?.shopName}</span></span>
                                        </div>
                                    </div>

                                    {/* Coupon Section */}
                                    <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                                        <div className="flex gap-4">
                                            <div className="relative flex-1">
                                                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                <input
                                                    type="text"
                                                    placeholder="Enter coupon code"
                                                    className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border border-transparent outline-none font-bold"
                                                />
                                            </div>
                                            <button className="px-8 py-4 bg-primary-100 text-primary-600 font-black rounded-2xl hover:bg-primary-600 hover:text-white transition-all">
                                                Apply
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={nextStep}
                                        className="w-full py-5 rounded-[1.8rem] bg-gray-900 text-white font-black text-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-xl"
                                    >
                                        Go to Payment <ArrowRight className="w-5 h-5" />
                                    </button>
                                </motion.div>
                            )}

                            {currentStep === "PAYMENT" && (
                                <motion.div
                                    key="payment"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="bg-white rounded-[2.5rem] border-2 border-primary-100 p-10 shadow-2xl shadow-primary-500/5 text-center"
                                >
                                    <div className="w-20 h-20 rounded-3xl bg-primary-50 flex items-center justify-center text-primary-600 mx-auto mb-8">
                                        <Lock className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-4">Secure Payment Initialization</h3>
                                    <p className="text-gray-500 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
                                        Your connection is encrypted. You will be redirected to the secure Razorpay gateway to complete your transaction in Indian Rupees.
                                    </p>

                                    <div className="grid grid-cols-2 gap-4 mb-10">
                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                            <ShieldCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">PCI-DSS Safe</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-2xl">
                                            <CheckCircle2 className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Original Store</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        disabled={isLoading}
                                        className="w-full py-6 rounded-[2rem] bg-primary-600 text-white font-black text-2xl hover:bg-primary-700 active:scale-95 transition-all shadow-xl shadow-primary-600/20 disabled:opacity-50"
                                    >
                                        {isLoading ? "Preparing..." : `Authorize ₹${grandTotal}`}
                                    </button>

                                    <div className="mt-8 flex items-center justify-center gap-6 opacity-30 grayscale saturate-0">
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" className="h-4" />
                                        <span className="w-px h-4 bg-gray-300" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">RuPay • UPI • Cards</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Side: Order Summary (Floating Sticky) */}
                    <div className="w-full lg:w-[400px] shrink-0">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 sm:p-10 shadow-xl shadow-gray-200/20 sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 mb-8">Detailed Summary</h3>

                            <div className="space-y-5 mb-8">
                                <div className="flex justify-between text-gray-500 font-bold">
                                    <span>Subtotal ({activeShop?.items.length} items)</span>
                                    <span className="text-gray-900 font-black">₹{totalPrice}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-bold">
                                    <div className="flex items-center gap-2">
                                        <span>GST (5%)</span>
                                        <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 cursor-help" title="Standard Goods and Services Tax">?</div>
                                    </div>
                                    <span className="text-gray-900 font-black">₹{tax}</span>
                                </div>
                                <div className="flex justify-between text-gray-500 font-bold">
                                    <span>Handling & Security</span>
                                    <span className="text-gray-900 font-black">₹{handlingFee}</span>
                                </div>
                            </div>

                            <div className="pt-8 border-t-2 border-dashed border-gray-100 space-y-4">
                                <div className="flex justify-between items-center bg-primary-50/50 p-6 rounded-3xl">
                                    <div>
                                        <p className="text-xs font-black text-primary-400 uppercase tracking-widest mb-1">Total Payable</p>
                                        <span className="text-4xl font-black text-primary-600 tracking-tighter">₹{grandTotal}</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded-2xl border border-primary-100 bg-primary-50/20 flex gap-4">
                                    <ShieldCheck className="w-6 h-6 text-primary-600 shrink-0" />
                                    <p className="text-[11px] font-bold text-primary-700/80 leading-relaxed uppercase tracking-tighter">
                                        You are saving ₹25 on fees with today's store promotion.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-10 flex flex-col items-center gap-4 text-center">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i + 10}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs font-bold text-gray-400">
                                    Trusted by <span className="text-gray-900 font-black">2,400+</span> regular shoppers in your area.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StepIndicator({ current, target, label, icon: Icon }: { current: CheckoutStep, target: CheckoutStep, label: string, icon: any }) {
    const steps: CheckoutStep[] = ["SHIPPING", "REVIEW", "PAYMENT"];
    const currentIdx = steps.indexOf(current);
    const targetIdx = steps.indexOf(target);

    const isCompleted = currentIdx > targetIdx;
    const isActive = current === target;

    return (
        <div className="flex flex-col items-center gap-1.5 px-3 py-1">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isCompleted ? 'bg-green-500 text-white shadow-lg shadow-green-200' :
                    isActive ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' :
                        'bg-gray-50 text-gray-300'
                }`}>
                {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
                {label}
            </span>
        </div>
    );
}
