import React, { useEffect, useState } from 'react';
import { Store, ShoppingBag, Package, DollarSign, Activity, Settings, TrendingUp, AlertCircle, Eye } from 'lucide-react';
import api from '../../lib/api';
import { format } from 'date-fns';

export default function SuperAdminMerchantDashboard() {
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/admin/merchant-dashboard');
                if (res.data.success) {
                    setData(res.data.data);
                }
            } catch (err) {
                console.error("Failed to fetch superadmin merchant data", err);
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
                <p>Failed to load Master Merchant dashboard data.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
            {/* Premium Header Architecture */}
            <div className="relative overflow-hidden bg-slate-900 text-white shadow-2xl pb-12 pt-8">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-secondary-600/10 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary-500/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2" />
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
                        {/* Shop Brand Section */}
                        <div className="flex flex-col sm:flex-row items-center gap-5 w-full lg:w-auto">
                            <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden relative group">
                                <div className="absolute inset-0 bg-primary-500 opacity-0 group-hover:opacity-10 shadow-inner transition-opacity" />
                                <Activity className="w-8 h-8 text-secondary-400 relative z-10" />
                            </div>
                            <div className="text-center sm:text-left">
                                <h1 className="text-3xl md:text-4xl font-black font-heading tracking-tight leading-none mb-2">
                                    Merchant Command Center
                                </h1>
                                <div className="flex items-center justify-center sm:justify-start gap-3">
                                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
                                        SUPER ADMIN PRIVILEGES
                                    </p>
                                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] font-black uppercase tracking-wider text-green-400">All Systems Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="hidden lg:flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 backdrop-blur-md">
                            <div>
                                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Total Platform Revenue</p>
                                <p className="text-2xl font-black text-white">₹{data.totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 w-full z-20 relative space-y-8 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-xl hover:border-slate-300 transition-all group">
                        <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600 w-fit group-hover:scale-110 transition-transform">
                            <Store className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Shops</p>
                            <div className="flex items-baseline gap-2">
                                <p className="text-3xl font-black text-slate-900 leading-none">{data.totalShops}</p>
                                <p className="text-xs font-bold text-slate-500">Owned by {data.totalShopOwners} Owners</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-xl hover:border-slate-300 transition-all group">
                        <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 w-fit group-hover:scale-110 transition-transform">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Products listed</p>
                            <p className="text-3xl font-black text-slate-900 leading-none">{data.totalProducts}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-xl hover:border-slate-300 transition-all group">
                        <div className="p-4 bg-green-50 rounded-2xl text-green-600 w-fit group-hover:scale-110 transition-transform">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Total Sales Processed</p>
                            <p className="text-3xl font-black text-slate-900 leading-none">{data.totalSalesCount}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col gap-3 hover:shadow-xl hover:border-slate-300 transition-all group">
                        <div className="p-4 bg-orange-50 rounded-2xl text-orange-600 w-fit group-hover:scale-110 transition-transform">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Platform Revenue</p>
                            <p className="text-3xl font-black text-slate-900 leading-none">₹{data.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                {/* Dashboard Flex Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Col - Shop List */}
                    <div className="lg:col-span-2 bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">All Registered Shops</h3>
                                <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Platform Directory</p>
                            </div>
                        </div>
                        <div className="p-8 overflow-x-auto max-h-[600px] overflow-y-auto w-full custom-scrollbar">
                            <table className="w-full text-left bg-white">
                                <thead className="sticky top-0 bg-white z-10 border-b border-slate-100">
                                    <tr>
                                        <th className="pb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Shop Name</th>
                                        <th className="pb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Owner/Contact</th>
                                        <th className="pb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">Category</th>
                                        <th className="pb-4 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {data.shopsList?.map((shop: any, i: number) => (
                                        <tr key={shop._id || i} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="py-4 pr-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-600 border border-slate-200 uppercase overflow-hidden shrink-0">
                                                        {shop.logo ? <img src={shop.logo} className="w-full h-full object-cover" alt="Shop" /> : shop.name?.substring(0, 2)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-slate-900">{shop.name}</p>
                                                        <p className="text-xs text-slate-500">{shop.slug}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4">
                                                <p className="font-bold text-sm text-slate-700">{shop.owner?.name}</p>
                                                <p className="text-xs text-slate-400">{shop.owner?.email}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1">{shop.contactPhone}</p>
                                            </td>
                                            <td className="py-4">
                                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{shop.category}</span>
                                            </td>
                                            <td className="py-4 text-right">
                                                <button className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-all font-bold text-sm flex items-center gap-2 justify-end ml-auto">
                                                    <Settings className="w-4 h-4" /> Manage
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right Col - Top Shops Ranked */}
                    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-50 bg-slate-50/50">
                            <h3 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                <TrendingUp className="w-6 h-6 text-green-500" /> Top Performer Shops
                            </h3>
                            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">Ranked by Total Revenue generated</p>
                        </div>
                        <div className="p-6 flex-1 bg-white">
                            <div className="space-y-4">
                                {data.topShops?.map((s: any, idx: number) => (
                                    <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:border-slate-300 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-black flex items-center justify-center text-sm shadow-inner shrink-0">
                                                #{idx + 1}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 tracking-tight">{s.name}</p>
                                                <div className="flex gap-2 items-center">
                                                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider items-center flex gap-1"><Package className="h-3 w-3" /> {s.salesCount} Sales</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-black text-green-600">₹{s.revenue.toLocaleString()}</p>
                                        </div>
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
