import React, { useEffect, useState } from 'react';
import { Users, DollarSign, Package, TrendingUp, Calendar, AlertCircle } from 'lucide-react';
import api from '../../lib/api';
import { format } from 'date-fns';

export default function SuperAdminCustomerDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/admin/customer-dashboard');
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch superadmin customer data", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50 text-red-500 font-bold flex-col gap-2">
                <AlertCircle className="w-10 h-10" />
                <p>Failed to load Super Admin dashboard data.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto mb-8 bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white overflow-hidden relative border border-slate-800">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-primary-500/20 p-2 rounded-xl border border-primary-500/30">
                            <Shield className="w-6 h-6 text-primary-400" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black font-heading tracking-tight">
                            Super Admin Overview
                        </h1>
                    </div>
                    <p className="text-slate-400 font-bold ml-14">Global Customer & Order Database</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:border-primary-200 transition-colors">
                    <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center shrink-0">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Total Users</p>
                        <p className="text-3xl font-black text-slate-900">{data.totalUsers}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:border-primary-200 transition-colors">
                    <div className="w-14 h-14 bg-green-50 text-green-600 rounded-[1.25rem] flex items-center justify-center shrink-0">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Total Amount Spent</p>
                        <p className="text-3xl font-black text-slate-900">₹{data.totalAmountSpent.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:border-primary-200 transition-colors">
                    <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-[1.25rem] flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Products Purchased</p>
                        <p className="text-3xl font-black text-slate-900">{data.totalProductsPurchased}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex items-center gap-5 hover:border-primary-200 transition-colors">
                    <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-[1.25rem] flex items-center justify-center shrink-0">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-slate-400 tracking-widest uppercase mb-1">Global Orders</p>
                        <p className="text-3xl font-black text-slate-900">{data.recentOrders.length}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users List */}
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="text-xl font-bold text-slate-900">Registered Customers</h3>
                        <span className="bg-primary-100 text-primary-700 text-xs font-black px-3 py-1 rounded-lg uppercase">Global Scale</span>
                    </div>
                    <div className="p-6 overflow-x-auto max-h-[500px] overflow-y-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest">User Details</th>
                                    <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest">Contact</th>
                                    <th className="pb-3 text-xs font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.usersList?.map((u: any) => (
                                    <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="py-4">
                                            <p className="font-bold text-slate-900">{u.name}</p>
                                            <p className="text-xs text-slate-500">{u.isVerified ? 'Verified' : 'Unverified'}</p>
                                        </td>
                                        <td className="py-4">
                                            <p className="text-sm text-slate-600 font-medium">{u.email}</p>
                                            <p className="text-xs text-slate-400">{u.phone || 'No phone'}</p>
                                        </td>
                                        <td className="py-4 text-sm font-bold text-slate-500">
                                            {format(new Date(u.createdAt), "MMM d, yyyy")}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Top Spenders & Recent Activity */}
                <div className="flex flex-col gap-8">
                    <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-900">Highest Spenders</h3>
                        </div>
                        <div className="p-6">
                            <div className="space-y-4">
                                {data.topUsers?.map((u: any, i: number) => (
                                    <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-black flex justify-center items-center text-xs">#{i + 1}</div>
                                            <div>
                                                <p className="font-bold text-slate-900">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.ordersCount} Total Orders</p>
                                            </div>
                                        </div>
                                        <p className="font-black text-lg text-green-600">₹{u.totalSpent.toLocaleString()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Dummy shield component to avoid importing missing icon if it happens
const Shield = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
);
