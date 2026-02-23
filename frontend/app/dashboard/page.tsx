"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";
import { Package, Receipt, Clock, CheckCircle, User, Edit3, Save, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
    const { user, isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
    const router = useRouter();
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

    // Profile State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push("/login");
        } else if (isAuthenticated && user) {
            const names = user.name.split(" ");
            setFirstName(names[0] || "");
            setLastName(names.slice(1).join(" ") || "");
            setPhone((user as any).phone || "");
            fetchOrders();
        }
    }, [isAuthLoading, isAuthenticated, router, user]);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/orders/my-orders");
            if (data.success) {
                setOrders(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setIsLoadingOrders(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUpdatingProfile(true);
        try {
            const fullName = `${firstName} ${lastName}`.trim();
            const { data } = await api.put("/auth/me", { name: fullName, phone });
            if (data.success) {
                toast.success("Profile updated successfully!");
                await checkAuth(); // Re-fetch user session details
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-800';
            case 'Paid': return 'bg-green-100 text-green-800';
            case 'Failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (isAuthLoading || (!isAuthenticated)) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">My Account</h1>
                        <p className="text-gray-600">Manage your orders and profile information</p>
                    </div>

                    <div className="flex gap-2 p-1 bg-white border border-gray-200 rounded-xl shadow-sm">
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-6 py-2.5 font-bold text-sm rounded-lg transition-all flex items-center gap-2 ${activeTab === 'orders' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <Package className="w-4 h-4" /> Orders
                        </button>
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`px-6 py-2.5 font-bold text-sm rounded-lg transition-all flex items-center gap-2 ${activeTab === 'profile' ? 'bg-primary-50 text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
                        >
                            <User className="w-4 h-4" /> Profile
                        </button>
                    </div>
                </div>

                {activeTab === 'profile' && (
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 sm:p-12 max-w-3xl border-t-[6px] border-t-primary-500">
                        <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-100">
                            <div className="h-24 w-24 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow-inner border-4 border-white ring-4 ring-primary-50">
                                {firstName.charAt(0)}{lastName.charAt(0)}
                            </div>
                            <div>
                                <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-1">{firstName} {lastName}</h2>
                                <p className="text-gray-500 font-bold bg-gray-50 inline-block px-3 py-1 rounded-lg border border-gray-200">{user?.email}</p>
                            </div>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Edit3 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            className="focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 block w-full pl-12 h-14 sm:text-sm border-gray-200 bg-gray-50 hover:bg-white rounded-2xl outline-none border transition-all font-bold text-gray-900 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <Edit3 className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            required
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            className="focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 block w-full pl-12 h-14 sm:text-sm border-gray-200 bg-gray-50 hover:bg-white rounded-2xl outline-none border transition-all font-bold text-gray-900 placeholder-gray-400"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Smartphone className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        className="focus:ring-4 focus:ring-primary-500/20 focus:border-primary-500 block w-full pl-12 h-14 sm:text-sm border-gray-200 bg-gray-50 hover:bg-white rounded-2xl outline-none border transition-all font-bold text-gray-900 placeholder-gray-400"
                                        placeholder="+91 98765 43210"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={isUpdatingProfile}
                                    className="h-14 flex justify-center px-10 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-4 focus:ring-primary-500/30 transition-all items-center gap-2 active:scale-95 w-full sm:w-auto"
                                >
                                    {isUpdatingProfile ? "Saving Details..." : <><Save className="w-5 h-5" /> Save Preferences</>}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {activeTab === 'orders' && (
                    isLoadingOrders ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center shadow-sm">
                            <Package className="h-20 w-20 text-gray-200 mx-auto mb-6" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders yet</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8">Looks like you haven't made any purchases yet. Start exploring GoleCentral!</p>
                            <button onClick={() => router.push('/shops')} className="px-8 py-4 bg-gray-900 text-white font-bold rounded-2xl hover:bg-gray-800 transition-colors shadow-lg active:scale-95 flex items-center gap-2 mx-auto">
                                <Package className="w-5 h-5" /> Browse Shops
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.map((order: any) => (
                                <div key={order._id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:border-primary-100 transition-all duration-300 group">
                                    <div className="bg-gray-50/80 px-8 py-5 flex flex-wrap justify-between items-center gap-6 border-b border-gray-100">
                                        <div className="flex flex-wrap gap-8 sm:gap-12 w-full sm:w-auto">
                                            <div>
                                                <p className="text-sm text-gray-500 font-bold mb-1 flex items-center gap-1.5 uppercase tracking-wider"><Clock className="w-4 h-4" /> Ordered On</p>
                                                <p className="text-base font-bold text-gray-900">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Total Amount</p>
                                                <p className="text-base font-bold text-gray-900">₹{order.totalAmount}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500 font-bold mb-1 uppercase tracking-wider">Order Reference</p>
                                                <p className="text-base font-bold text-gray-900 font-mono tracking-tight" title={order._id}>#{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 w-full sm:w-auto mt-4 sm:mt-0 justify-between sm:justify-end">
                                            <span className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${statusColor(order.status)}`}>
                                                {order.status === 'Paid' ? <CheckCircle className="w-4 h-4" /> : null}
                                                {order.status}
                                            </span>
                                            <button className="text-sm font-bold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 border border-transparent hover:border-primary-100">
                                                <Receipt className="w-4 h-4" /> Invoice
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-200 pb-3"><User className="w-5 h-5 text-gray-400" /> Shipping Information</h4>
                                            <p className="text-base text-gray-900 font-bold mb-2">{firstName} {lastName}</p>
                                            <p className="text-sm text-gray-600 font-medium mb-1">{order.shippingAddress.street}</p>
                                            <p className="text-sm text-gray-600 font-medium">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                            <p className="text-sm text-gray-600 font-medium mt-1">{order.shippingAddress.country}</p>
                                        </div>

                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 border-b border-gray-200 pb-3"><Receipt className="w-5 h-5 text-gray-400" /> Payment Details</h4>
                                            <div className="space-y-3">
                                                <p className="text-sm text-gray-600 flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                                    <span className="font-bold">Payment Method</span>
                                                    <span className="font-bold text-gray-900 text-base">Razorpay</span>
                                                </p>
                                                {order.paymentId && (
                                                    <p className="text-sm text-gray-600 flex justify-between items-center bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                                                        <span className="font-bold">Transaction ID</span>
                                                        <span className="font-mono font-bold text-gray-900 text-xs truncate max-w-[150px]">{order.paymentId}</span>
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}
