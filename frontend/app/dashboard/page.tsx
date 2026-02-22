"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";
import { Package, Receipt, Clock, CheckCircle } from "lucide-react";

export default function CustomerDashboard() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const { data } = await api.get("/orders/my-orders");
            if (data.success) {
                setOrders(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch orders", err);
        } finally {
            setIsLoading(false);
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

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-10">
                    <h1 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your purchases</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
                        <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">Looks like you haven't made any purchases yet. Start exploring Gole Market!</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order: any) => (
                            <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                    <div className="flex gap-8">
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium mb-1 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Order Placed</p>
                                            <p className="text-sm font-semibold text-gray-900">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium mb-1">Total Amount</p>
                                            <p className="text-sm font-semibold text-gray-900">₹{order.totalAmount}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 font-medium mb-1">Order #</p>
                                            <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]" title={order._id}>{order._id}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1.5 ${statusColor(order.status)}`}>
                                            {order.status === 'Paid' ? <CheckCircle className="w-3 h-3" /> : null}
                                            {order.status}
                                        </span>
                                        <button className="text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5">
                                            <Receipt className="w-4 h-4" /> Invoice
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Shipping Information</h4>
                                        <p className="text-sm text-gray-800 font-medium">{user?.name}</p>
                                        <p className="text-sm text-gray-600 mt-1">{order.shippingAddress.street}</p>
                                        <p className="text-sm text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                                        <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-4 border-b pb-2">Payment Details</h4>
                                        <p className="text-sm text-gray-600 flex justify-between mb-2">
                                            <span>Payment Method</span>
                                            <span className="font-medium text-gray-900">Razorpay</span>
                                        </p>
                                        {order.paymentId && (
                                            <p className="text-sm text-gray-600 flex justify-between">
                                                <span>Payment Reference</span>
                                                <span className="font-medium text-gray-900 truncate max-w-[180px]">{order.paymentId}</span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
