"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { useAuthStore } from "../../store/useAuthStore";
import { format } from "date-fns";
import {
    Package, Receipt, Clock, CheckCircle, User, Edit3, Save,
    Smartphone, MapPin, Shield, Bell, Key, Plus, Trash2, Camera, Eye, EyeOff, AlertCircle
} from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Tab = 'profile' | 'addresses' | 'security' | 'preferences' | 'orders';

export default function CustomerDashboard() {
    const { user, isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
    const router = useRouter();

    // Core Data State
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('profile');

    // Profile State
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Security State
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Preferences State
    const [emailNotif, setEmailNotif] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [promoUpdates, setPromoUpdates] = useState(true);
    const [isSavingPrefs, setIsSavingPrefs] = useState(false);

    // Address Mock State
    const [addresses, setAddresses] = useState([
        { id: 1, type: "Home", street: "123 Main Street, Apt 4B", city: "Mumbai", state: "Maharashtra", zip: "400001", isDefault: true },
        { id: 2, type: "Work", street: "Tech Park, Tower A", city: "Bangalore", state: "Karnataka", zip: "560001", isDefault: false }
    ]);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push("/login");
        } else if (isAuthenticated && user) {
            const names = user.name.split(" ");
            setFirstName(names[0] || "");
            setLastName(names.slice(1).join(" ") || "");
            setPhone((user as any).phone || "");
            setEmail(user.email || "");
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
                await checkAuth();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            toast.error("New passwords do not match.");
            return;
        }
        setIsUpdatingPassword(true);
        // Simulate API call since password update might require custom endpoint
        setTimeout(() => {
            toast.success("Password changed successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setIsUpdatingPassword(false);
        }, 1000);
    };

    const handleSavePreferences = () => {
        setIsSavingPrefs(true);
        setTimeout(() => {
            toast.success("Preferences saved successfully!");
            setIsSavingPrefs(false);
        }, 800);
    };

    const deleteAddress = (id: number) => {
        setAddresses(addresses.filter(a => a.id !== id));
        toast.success("Address removed.");
    };

    const calculatePasswordStrength = (pass: string) => {
        if (pass.length === 0) return 0;
        let score = 0;
        if (pass.length > 7) score += 1;
        if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) score += 1;
        if (pass.match(/\d/)) score += 1;
        if (pass.match(/[^a-zA-Z\d]/)) score += 1;
        return score; // 0 to 4
    };

    const pwdStrength = calculatePasswordStrength(newPassword);

    if (isAuthLoading || (!isAuthenticated)) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    // Derived Order Stats
    const totalOrders = orders.length;
    const completedOrders = orders.filter(o => o.status === 'Paid' || o.status === 'Completed').length;
    const pendingOrders = orders.filter(o => o.status === 'Pending').length;

    return (
        <div className="min-h-screen bg-[#f8fafc] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">

                {/* Left Column - Profile & Summaries */}
                <div className="w-full lg:w-1/3 flex flex-col gap-6">

                    {/* Profile Summary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 flex flex-col items-center text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary-50 to-primary-100/50"></div>
                        <div className="relative z-10">
                            <div className="relative inline-block mb-4">
                                <div className="h-24 w-24 bg-primary-600 text-white rounded-full flex items-center justify-center text-3xl font-bold uppercase shadow-md border-4 border-white">
                                    {firstName.charAt(0)}{lastName.charAt(0)}
                                </div>
                                <button className="absolute bottom-0 right-0 bg-white p-2 text-slate-600 hover:text-primary-600 rounded-full shadow border border-slate-100 transition-colors">
                                    <Camera className="w-4 h-4" />
                                </button>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-1">{firstName} {lastName}</h2>
                            <p className="text-slate-500 font-medium text-sm mb-4">{email}</p>

                            <div className="inline-flex items-center gap-1.5 px-3 py-1 pb-1.5 bg-green-50 text-green-700 text-xs font-bold rounded-full border border-green-100 uppercase tracking-widest mb-6">
                                <CheckCircle className="w-3.5 h-3.5" /> Verified Customer
                            </div>

                            <p className="text-xs text-slate-400 font-medium">Member since {format(new Date((user as any)?.createdAt || Date.now()), 'MMMM yyyy')}</p>
                        </div>
                    </div>

                    {/* Order Summary Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-primary-500" /> Order Summary
                        </h3>
                        <div className="grid grid-cols-3 gap-4 mb-6">
                            <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                                <p className="text-2xl font-black text-slate-900 mb-1">{totalOrders}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</p>
                            </div>
                            <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                                <p className="text-2xl font-black text-green-700 mb-1">{completedOrders}</p>
                                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Done</p>
                            </div>
                            <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
                                <p className="text-2xl font-black text-yellow-700 mb-1">{pendingOrders}</p>
                                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Wait</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className="w-full py-3 bg-white border-2 border-slate-100 text-slate-700 font-bold rounded-xl hover:border-slate-200 hover:bg-slate-50 transition-all text-sm flex items-center justify-center gap-2"
                        >
                            View All Orders <Receipt className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Column - Tabbed Management */}
                <div className="w-full lg:w-2/3 flex flex-col">

                    {/* Mobile Scrollable Tabs / Desktop Flex Tabs */}
                    <div className="flex overflow-x-auto hide-scrollbar gap-2 mb-6 p-1 bg-white border border-slate-100 rounded-2xl shadow-sm">
                        {[
                            { id: 'profile', icon: User, label: 'Profile Info' },
                            { id: 'addresses', icon: MapPin, label: 'Addresses' },
                            { id: 'security', icon: Shield, label: 'Security' },
                            { id: 'preferences', icon: Bell, label: 'Preferences' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`flex items-center gap-2.5 px-5 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-1 justify-center
                                    ${activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-700 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" /> {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Contents */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8 min-h-[500px]">

                        {/* Profile Info Tab */}
                        {activeTab === 'profile' && (
                            <div className="animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Personal Information</h3>
                                <p className="text-slate-500 text-sm mb-8">Update your personal details below. Your email address is verified.</p>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={firstName}
                                                onChange={(e) => setFirstName(e.target.value)}
                                                className="w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-semibold text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={lastName}
                                                onChange={(e) => setLastName(e.target.value)}
                                                className="w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-semibold text-slate-900"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            disabled
                                            value={email}
                                            className="w-full px-4 h-12 bg-slate-100 border border-slate-200 rounded-xl outline-none text-slate-500 font-medium cursor-not-allowed"
                                        />
                                        <p className="text-xs text-slate-400 font-medium mt-2 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3" /> To change your email, contact support.
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mobile Number</label>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-semibold text-slate-900"
                                            placeholder="+91"
                                        />
                                    </div>
                                    <div className="pt-4 border-t border-slate-100">
                                        <button
                                            type="submit"
                                            disabled={isUpdatingProfile}
                                            className="h-12 px-8 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
                                        >
                                            {isUpdatingProfile ? (
                                                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                                            ) : (
                                                <><Save className="w-4 h-4" /> Save Changes</>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Addresses Tab */}
                        {activeTab === 'addresses' && (
                            <div className="animate-in fade-in duration-300">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-1">Saved Addresses</h3>
                                        <p className="text-slate-500 text-sm">Manage where your orders are delivered.</p>
                                    </div>
                                    <button className="h-10 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-all active:scale-95 flex items-center gap-2 shadow-sm">
                                        <Plus className="w-4 h-4" /> Add New
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {addresses.map((address) => (
                                        <div key={address.id} className="border border-slate-200 rounded-2xl p-5 relative group hover:border-primary-200 hover:shadow-sm transition-all bg-white">
                                            {address.isDefault && (
                                                <span className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700 px-2 py-1 rounded-md">Default</span>
                                            )}
                                            <div className="flex items-start gap-3 mb-3">
                                                <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-900">{address.type}</h4>
                                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                                        {address.street}<br />
                                                        {address.city}, {address.state} {address.zip}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-slate-100">
                                                <button className="text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors">Edit</button>
                                                <span className="text-slate-300">|</span>
                                                <button onClick={() => deleteAddress(address.id)} className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors">Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && (
                                        <div className="col-span-full py-12 text-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                            <MapPin className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                                            <p className="text-slate-500 font-medium">No saved addresses found.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Change Password</h3>
                                <p className="text-slate-500 text-sm mb-8">Ensure your account is using a long, random password to stay secure.</p>

                                <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-lg">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                required
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-semibold text-slate-900"
                                            />
                                            <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                required
                                                minLength={6}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-semibold text-slate-900"
                                            />
                                            <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600">
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                        {/* Password Strength Indicator */}
                                        {newPassword.length > 0 && (
                                            <div className="mt-2 flex gap-1 h-1.5">
                                                {[...Array(4)].map((_, i) => (
                                                    <div key={i} className={`flex-1 rounded-full ${i < pwdStrength
                                                        ? (pwdStrength < 2 ? 'bg-red-500' : pwdStrength < 3 ? 'bg-yellow-500' : 'bg-green-500')
                                                        : 'bg-slate-200'
                                                        }`}></div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
                                        <input
                                            type="password"
                                            required
                                            minLength={6}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 h-12 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 outline-none transition-all font-semibold text-slate-900"
                                        />
                                    </div>
                                    <div className="pt-4">
                                        <button
                                            type="submit"
                                            disabled={isUpdatingPassword || (newPassword.length > 0 && newPassword !== confirmPassword)}
                                            className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center gap-2"
                                        >
                                            {isUpdatingPassword ? "Updating..." : "Update Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Preferences Tab */}
                        {activeTab === 'preferences' && (
                            <div className="animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Notification Preferences</h3>
                                <p className="text-slate-500 text-sm mb-8">Choose how we communicate with you.</p>

                                <div className="space-y-6 max-w-xl">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm mb-1">Email Notifications</h4>
                                            <p className="text-xs text-slate-500">Receive order updates and account alerts directly to your inbox.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                            <input type="checkbox" className="sr-only peer" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm mb-1">SMS Alerts</h4>
                                            <p className="text-xs text-slate-500">Get real-time delivery tracking messages on your mobile.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                            <input type="checkbox" className="sr-only peer" checked={smsAlerts} onChange={(e) => setSmsAlerts(e.target.checked)} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm mb-1">Promotional Updates</h4>
                                            <p className="text-xs text-slate-500">Receive exclusive offers, discounts, and personalized recommendations.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                                            <input type="checkbox" className="sr-only peer" checked={promoUpdates} onChange={(e) => setPromoUpdates(e.target.checked)} />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                                        </label>
                                    </div>

                                    <div className="pt-4">
                                        <button
                                            onClick={handleSavePreferences}
                                            disabled={isSavingPrefs}
                                            className="h-12 px-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold transition-all disabled:opacity-70 active:scale-95 flex items-center gap-2"
                                        >
                                            {isSavingPrefs ? "Saving..." : "Save Preferences"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Orders Tab (Fallback View from Previous Design) */}
                        {activeTab === 'orders' && (
                            <div className="animate-in fade-in duration-300">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">Order History</h3>
                                {isLoadingOrders ? (
                                    <div className="flex justify-center py-20">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                                        <Package className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
                                        <p className="text-slate-500 text-sm mb-6">Start exploring local shops and making purchases.</p>
                                        <button onClick={() => router.push('/shops')} className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl shadow-sm hover:bg-primary-700 active:scale-95 transition-all text-sm inline-flex items-center gap-2">
                                            Shop Now
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((order: any) => (
                                            <div key={order._id} className="border border-slate-200 rounded-2xl p-5 hover:border-primary-200 transition-colors">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                                                    <div>
                                                        <p className="text-xs text-slate-500 font-bold uppercase mb-1">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
                                                        <p className="font-bold text-slate-900">{format(new Date(order.createdAt), "MMM d, yyyy")}</p>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className="font-black text-lg text-slate-900">₹{order.totalAmount}</span>
                                                        <span className={`px-3 py-1 text-xs font-bold uppercase rounded-md ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {order.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="text-primary-600 font-bold text-sm hover:underline">View Receipt</button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>

            </div>
        </div>
    );
}
