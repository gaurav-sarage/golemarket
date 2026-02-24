"use client";

import { useState } from "react";
import api from "../../lib/api";
import { Save, Store, MapPin, Phone, Mail, Clock, ShieldCheck, Truck, CreditCard, Radio, Activity, ChevronRight, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

interface StoreSettingsProps {
    shop: any;
    onUpdate: (shop: any) => void;
}

const TimePicker = ({ value, onChange, disabled }: { value: string, onChange: (val: string) => void, disabled?: boolean }) => {
    const parts = value.split(/[: ]/);
    const h = parts[0] || "09";
    const m = parts[1] || "00";
    const p = parts[2] || "AM";

    return (
        <div className={`flex items-center gap-1.5 ${disabled ? 'opacity-20 pointer-events-none' : ''}`}>
            <div className="flex bg-gray-50 rounded-2xl p-1.5 border-2 border-gray-100 shadow-sm transition-all focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-500/10">
                <select
                    value={h}
                    onChange={(e) => onChange(`${e.target.value}:${m} ${p}`)}
                    className="bg-transparent text-sm font-black outline-none cursor-pointer px-2 w-12 sm:w-14 text-center appearance-none"
                >
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(val => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
                <span className="text-sm font-black text-gray-300 self-center mx-0.5">:</span>
                <select
                    value={m}
                    onChange={(e) => onChange(`${h}:${e.target.value} ${p}`)}
                    className="bg-transparent text-sm font-black outline-none cursor-pointer px-2 w-12 sm:w-14 text-center appearance-none"
                >
                    {['00', '15', '30', '45'].map(val => (
                        <option key={val} value={val}>{val}</option>
                    ))}
                </select>
                <select
                    value={p}
                    onChange={(e) => onChange(`${h}:${m} ${e.target.value}`)}
                    className="bg-primary-50 text-xs font-black outline-none cursor-pointer px-3 py-1.5 rounded-xl ml-2 text-primary-700 hover:bg-primary-100 transition-colors appearance-none"
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
        </div>
    );
};

export default function StoreSettings({ shop, onUpdate }: StoreSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const [form, setForm] = useState({
        name: shop?.name || "",
        description: shop?.description || "",
        contactEmail: shop?.contactEmail || "",
        contactPhone: shop?.contactPhone || "",
        businessHours: shop?.businessHours?.length === 7 ? shop.businessHours : DAYS.map(day => ({
            day,
            open: "09:00 AM",
            close: "10:00 PM",
            isClosed: false
        })),
        deliveryType: shop?.deliveryType || "both",
        minimumOrderAmount: shop?.minimumOrderAmount || 0,
        deliveryCharges: shop?.deliveryCharges || 0,
        serviceRadius: shop?.serviceRadius || 5,
        address: {
            street: shop?.address?.street || "",
            city: shop?.address?.city || "",
            state: shop?.address?.state || "",
            zipCode: shop?.address?.zipCode || "",
        },
        policies: {
            returnPolicy: shop?.policies?.returnPolicy || "",
            deliveryPolicy: shop?.policies?.deliveryPolicy || "",
        }
    });

    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('contactEmail', form.contactEmail);
            formData.append('contactPhone', form.contactPhone);
            formData.append('businessHours', JSON.stringify(form.businessHours));
            formData.append('deliveryType', form.deliveryType);
            formData.append('minimumOrderAmount', String(form.minimumOrderAmount));
            formData.append('deliveryCharges', String(form.deliveryCharges));
            formData.append('serviceRadius', String(form.serviceRadius));
            formData.append('address', JSON.stringify(form.address));
            formData.append('policies', JSON.stringify(form.policies));

            if (logoFile) formData.append('logo', logoFile);
            if (bannerFile) formData.append('banner', bannerFile);

            const { data } = await api.put(`/shops/${shop._id}`, formData);

            if (data.success) {
                toast.success("Store settings updated!");
                onUpdate(data.data);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-7xl mx-auto pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                        <Store className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Store Settings</h2>
                        <p className="text-gray-500 font-bold text-sm tracking-wide uppercase">Manage your digital storefront</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto flex items-center justify-center gap-3 bg-primary-600 text-white px-10 py-4 rounded-2xl font-black hover:bg-primary-700 shadow-2xl shadow-primary-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                >
                    {isLoading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : <Save className="w-6 h-6" />}
                    {isLoading ? "SAVING..." : "SAVE CHANGES"}
                </button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Section - Main Identity */}
                <div className="xl:col-span-8 space-y-8">
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-3">
                                <Activity className="w-6 h-6 text-primary-500" /> BRANDING & APPEARANCE
                            </h3>
                        </div>

                        <div className="p-8 space-y-8">
                            {/* Banner Upload */}
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Shop Banner Image</label>
                                <div className="group relative aspect-[21/9] sm:aspect-[3/1] rounded-[32px] overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 transition-all hover:border-primary-300">
                                    {bannerFile ? (
                                        <img src={URL.createObjectURL(bannerFile)} className="w-full h-full object-cover" alt="" />
                                    ) : shop?.bannerImage ? (
                                        <img src={shop.bannerImage} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-gray-100">
                                                <Activity className="w-6 h-6" />
                                            </div>
                                            <span className="text-xs font-black tracking-widest uppercase">Upload Banner</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                                        <button type="button" onClick={() => document.getElementById('banner-upload')?.click()} className="bg-white text-gray-900 px-6 py-3 rounded-2xl text-xs font-black shadow-2xl scale-90 group-hover:scale-100 transition-transform">CHANGE BANNER</button>
                                    </div>
                                    <input id="banner-upload" type="file" className="sr-only" accept="image/*" onChange={e => (e.target.files && setBannerFile(e.target.files[0]))} />
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 items-start">
                                {/* Logo Upload */}
                                <div className="group relative w-32 h-32 sm:w-40 sm:h-40 shrink-0 rounded-[32px] overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 transition-all hover:border-primary-300">
                                    {logoFile ? (
                                        <img src={URL.createObjectURL(logoFile)} className="w-full h-full object-cover" alt="" />
                                    ) : shop?.logoImage ? (
                                        <img src={shop.logoImage} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                            <Store className="w-8 h-8" />
                                            <span className="text-[10px] font-black tracking-widest uppercase">LOGO</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-[2px]">
                                        <button type="button" onClick={() => document.getElementById('logo-upload')?.click()} className="bg-white p-3 rounded-xl text-gray-900 shadow-2xl"><Activity className="w-5 h-5" /></button>
                                    </div>
                                    <input id="logo-upload" type="file" className="sr-only" accept="image/*" onChange={e => (e.target.files && setLogoFile(e.target.files[0]))} />
                                </div>

                                <div className="flex-1 w-full space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Legal Shop name</label>
                                        <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-black text-gray-900 outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] px-1">Shop Bio / Description</label>
                                        <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-4 font-bold text-gray-700 outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all min-h-[100px] leading-relaxed" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Location */}
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 tracking-widest uppercase">
                                    <MapPin className="w-4 h-4 text-primary-500" /> LOCATION
                                </h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase px-1">Street address</label>
                                    <input required value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase px-1">City</label>
                                        <input required value={form.address.city} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase px-1">ZIP</label>
                                        <input required value={form.address.zipCode} onChange={e => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery */}
                        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 tracking-widest uppercase">
                                    <Truck className="w-4 h-4 text-primary-500" /> LOGISTICS
                                </h3>
                            </div>
                            <div className="p-6 space-y-5">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase px-1">ORDER Type</label>
                                    <select value={form.deliveryType} onChange={e => setForm({ ...form, deliveryType: e.target.value as any })} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all">
                                        <option value="delivery">Only Home Delivery</option>
                                        <option value="pickup">Only Self Pickup</option>
                                        <option value="both">All Support</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase px-1">Min (₹)</label>
                                        <input type="number" value={form.minimumOrderAmount} onChange={e => setForm({ ...form, minimumOrderAmount: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all" />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase px-1">Fee (₹)</label>
                                        <input type="number" value={form.deliveryCharges} onChange={e => setForm({ ...form, deliveryCharges: Number(e.target.value) })} className="w-full bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Section - Operations & Hours */}
                <div className="xl:col-span-4 space-y-8">
                    {/* Business Hours - The Redesigned Component */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gray-900 text-white">
                            <h3 className="text-sm font-black flex items-center gap-3 tracking-[0.2em]">
                                <Clock className="w-5 h-5 text-primary-400" /> OPERATION HOURS
                            </h3>
                        </div>

                        <div className="p-8 space-y-4">
                            {form.businessHours.map((schedule: any, index: number) => (
                                <div key={schedule.day} className={`flex flex-col sm:flex-row sm:items-center justify-between p-6 rounded-[32px] transition-all border-2 ${schedule.isClosed ? 'bg-red-50/30 border-red-50 grayscale-[0.5]' : 'bg-white border-gray-50 hover:border-primary-100 hover:shadow-xl hover:shadow-primary-500/5 group'}`}>
                                    <div className="flex items-center gap-4 mb-4 sm:mb-0">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs ${schedule.isClosed ? 'bg-red-100 text-red-600' : 'bg-primary-50 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300'}`}>
                                            {schedule.day.substring(0, 3)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-black text-gray-900">{schedule.day}</span>
                                            <span className={`text-[10px] font-black uppercase tracking-widest ${schedule.isClosed ? 'text-red-400' : 'text-green-500'}`}>
                                                {schedule.isClosed ? 'Currently Closed' : 'Operational'}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 justify-end">
                                        {!schedule.isClosed ? (
                                            <div className="flex items-center gap-3">
                                                <TimePicker
                                                    value={schedule.open}
                                                    onChange={(val) => {
                                                        const newHours = [...form.businessHours];
                                                        newHours[index].open = val;
                                                        setForm({ ...form, businessHours: newHours });
                                                    }}
                                                />
                                                <div className="w-6 h-[2px] bg-gray-100 rounded-full" />
                                                <TimePicker
                                                    value={schedule.close}
                                                    onChange={(val) => {
                                                        const newHours = [...form.businessHours];
                                                        newHours[index].close = val;
                                                        setForm({ ...form, businessHours: newHours });
                                                    }}
                                                />
                                            </div>
                                        ) : (
                                            <div className="px-6 py-3 bg-red-100/50 rounded-2xl border border-red-100">
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-[0.2em] flex items-center gap-2">
                                                    <AlertCircle className="w-3 h-3" /> STORE IS CLOSED FOR THE DAY
                                                </span>
                                            </div>
                                        )}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newHours = [...form.businessHours];
                                                newHours[index].isClosed = !newHours[index].isClosed;
                                                setForm({ ...form, businessHours: newHours });
                                            }}
                                            className={`shrink-0 h-14 px-6 rounded-2xl flex items-center justify-center gap-3 transition-all font-black text-[10px] tracking-widest border-2 ${schedule.isClosed
                                                ? 'bg-red-600 text-white border-red-500 shadow-xl shadow-red-500/20'
                                                : 'bg-white text-gray-400 border-gray-100 hover:text-green-600 hover:border-green-100'
                                                }`}
                                        >
                                            <div className={`w-2 h-2 rounded-full ${schedule.isClosed ? 'bg-white' : 'bg-green-500 animate-pulse'}`} />
                                            {schedule.isClosed ? 'OPEN IT' : 'CLOSE IT'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Card */}
                    <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                            <h3 className="text-sm font-black text-gray-900 flex items-center gap-2 tracking-widest uppercase">
                                <Phone className="w-4 h-4 text-primary-500" /> SUPPORT
                            </h3>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Support Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input required type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full pl-11 bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all shadow-inner" />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Mobile NO.</label>
                                <div className="relative">
                                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input required type="tel" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="w-full pl-11 bg-gray-50 border border-gray-100 rounded-xl p-3.5 text-sm font-black outline-none focus:bg-white transition-all shadow-inner" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Policies Section */}
                <div className="xl:col-span-12">
                    <div className="bg-white p-8 rounded-[48px] shadow-sm border border-gray-100">
                        <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4">
                            <ShieldCheck className="w-8 h-8 text-primary-500" /> POLICIES & LEGAL
                        </h3>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-black text-xs">01</div>
                                    <label className="text-lg font-black text-gray-900">Return & Refund Policy</label>
                                </div>
                                <textarea value={form.policies.returnPolicy} onChange={e => setForm({ ...form, policies: { ...form.policies, returnPolicy: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm font-bold text-gray-600 outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all min-h-[150px] leading-relaxed shadow-inner" placeholder="E.g. Returns accepted within 7 days in original condition..." />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">02</div>
                                    <label className="text-lg font-black text-gray-900">Shipping Policy</label>
                                </div>
                                <textarea value={form.policies.deliveryPolicy} onChange={e => setForm({ ...form, policies: { ...form.policies, deliveryPolicy: e.target.value } })} className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 text-sm font-bold text-gray-600 outline-none focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all min-h-[150px] leading-relaxed shadow-inner" placeholder="E.g. Deliveries within 2-5km, standard charges apply..." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
