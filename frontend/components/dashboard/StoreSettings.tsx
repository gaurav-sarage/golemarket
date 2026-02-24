"use client";

import { useState } from "react";
import api from "../../lib/api";
import { Save, Store, MapPin, Phone, Mail, Clock, ShieldCheck, Truck, CreditCard, Radio, Activity } from "lucide-react";
import toast from "react-hot-toast";

interface StoreSettingsProps {
    shop: any;
    onUpdate: (shop: any) => void;
}

export default function StoreSettings({ shop, onUpdate }: StoreSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        name: shop?.name || "",
        description: shop?.description || "",
        contactEmail: shop?.contactEmail || "",
        contactPhone: shop?.contactPhone || "",
        businessHours: shop?.businessHours || "",
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

            // Basic fields
            formData.append('name', form.name);
            formData.append('description', form.description);
            formData.append('contactEmail', form.contactEmail);
            formData.append('contactPhone', form.contactPhone);
            formData.append('businessHours', form.businessHours);
            formData.append('deliveryType', form.deliveryType);
            formData.append('minimumOrderAmount', String(form.minimumOrderAmount));
            formData.append('deliveryCharges', String(form.deliveryCharges));
            formData.append('serviceRadius', String(form.serviceRadius));

            // Nested objects
            formData.append('address', JSON.stringify(form.address));
            formData.append('policies', JSON.stringify(form.policies));

            if (logoFile) formData.append('logo', logoFile);
            if (bannerFile) formData.append('banner', bannerFile);

            const { data } = await api.put(`/shops/${shop._id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

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
        <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Store Settings</h2>
                    <p className="text-gray-500">Update your shop branding, policies, and operational details.</p>
                </div>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all disabled:opacity-50"
                >
                    <Save className="w-5 h-5" />
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>

            {/* Branding Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Store className="w-5 h-5 text-primary-500" /> Branding & Identity
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">Store Banner</label>
                        <div
                            className="relative h-48 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center cursor-pointer hover:border-primary-500 transition-all overflow-hidden"
                            onClick={() => document.getElementById('banner-upload')?.click()}
                        >
                            {bannerFile ? (
                                <img src={URL.createObjectURL(bannerFile)} className="w-full h-full object-cover" alt="Banner preview" />
                            ) : shop?.bannerImage ? (
                                <img src={shop.bannerImage} className="w-full h-full object-cover" alt="Current banner" />
                            ) : (
                                <>
                                    <Activity className="w-10 h-10 text-gray-300 mb-2" />
                                    <p className="text-xs text-gray-500 font-bold">1200 x 400 suggested</p>
                                </>
                            )}
                            <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                                <span className="bg-white/90 text-gray-900 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">Change Banner</span>
                            </div>
                            <input id="banner-upload" type="file" className="sr-only" accept="image/*" onChange={e => e.target.files && setBannerFile(e.target.files[0])} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-700">Store Logo</label>
                        <div className="flex items-center gap-6">
                            <div
                                className="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex items-center justify-center cursor-pointer hover:border-primary-500 transition-all overflow-hidden shrink-0"
                                onClick={() => document.getElementById('logo-upload')?.click()}
                            >
                                {logoFile ? (
                                    <img src={URL.createObjectURL(logoFile)} className="w-full h-full object-cover" alt="Logo preview" />
                                ) : shop?.logoImage ? (
                                    <img src={shop.logoImage} className="w-full h-full object-cover" alt="Current logo" />
                                ) : (
                                    <Store className="w-8 h-8 text-gray-300" />
                                )}
                                <input id="logo-upload" type="file" className="sr-only" accept="image/*" onChange={e => e.target.files && setLogoFile(e.target.files[0])} />
                            </div>
                            <div className="space-y-4 flex-1">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Store Name</label>
                                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50 focus:bg-white transition-all font-medium" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                        <textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border-gray-200 rounded-xl p-4 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50 focus:bg-white transition-all min-h-[120px]" />
                    </div>
                </div>
            </div>

            {/* Contact & Location Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Phone className="w-5 h-5 text-primary-500" /> Contact Details
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Public Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input required type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Public Phone</label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input required type="tel" value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Business Hours</label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input required type="text" value={form.businessHours} onChange={e => setForm({ ...form, businessHours: e.target.value })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" placeholder="e.g. 9:00 AM - 10:00 PM" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-500" /> Store Location
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                            <input required type="text" value={form.address.street} onChange={e => setForm({ ...form, address: { ...form.address, street: e.target.value } })} className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">City</label>
                                <input required type="text" value={form.address.city} onChange={e => setForm({ ...form, address: { ...form.address, city: e.target.value } })} className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ZIP Code</label>
                                <input required type="text" value={form.address.zipCode} onChange={e => setForm({ ...form, address: { ...form.address, zipCode: e.target.value } })} className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delivery & Logistics */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary-500" /> Delivery & Logistics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Delivery Type</label>
                        <select value={form.deliveryType} onChange={e => setForm({ ...form, deliveryType: e.target.value as any })} className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50">
                            <option value="delivery">Delivery Only</option>
                            <option value="pickup">Pickup Only</option>
                            <option value="both">Both Delivery & Pickup</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Service Radius (km)</label>
                        <div className="relative">
                            <Radio className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input type="number" value={form.serviceRadius} onChange={e => setForm({ ...form, serviceRadius: Number(e.target.value) })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Min. Order Amount (₹)</label>
                        <div className="relative">
                            <CreditCard className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                            <input type="number" value={form.minimumOrderAmount} onChange={e => setForm({ ...form, minimumOrderAmount: Number(e.target.value) })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Policies Section */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary-500" /> Store Policies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Return & Refund Policy</label>
                        <textarea value={form.policies.returnPolicy} onChange={e => setForm({ ...form, policies: { ...form.policies, returnPolicy: e.target.value } })} className="w-full border-gray-200 rounded-xl p-4 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50 min-h-[150px]" placeholder="Explain your return rules..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Delivery Policy</label>
                        <textarea value={form.policies.deliveryPolicy} onChange={e => setForm({ ...form, policies: { ...form.policies, deliveryPolicy: e.target.value } })} className="w-full border-gray-200 rounded-xl p-4 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50 min-h-[150px]" placeholder="Explain your delivery timelines and zones..." />
                    </div>
                </div>
            </div>
        </form>
    );
}
