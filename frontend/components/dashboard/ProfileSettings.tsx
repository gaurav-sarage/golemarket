"use client";

import { useState } from "react";
import api from "../../lib/api";
import { User, Mail, Phone, Lock, Save, Camera, Building, CreditCard, Hash } from "lucide-react";
import toast from "react-hot-toast";

interface ProfileSettingsProps {
    user: any;
    onUpdate: () => void;
}

export default function ProfileSettings({ user, onUpdate }: ProfileSettingsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [form, setForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        payoutDetails: {
            bankName: user?.payoutDetails?.bankName || "",
            accountHolderName: user?.payoutDetails?.accountHolderName || "",
            accountNumber: user?.payoutDetails?.accountNumber || "",
            ifscCode: user?.payoutDetails?.ifscCode || "",
        }
    });

    const [profileFile, setProfileFile] = useState<File | null>(null);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('name', form.name);
            formData.append('email', form.email);
            formData.append('phone', form.phone);
            formData.append('payoutDetails', JSON.stringify(form.payoutDetails));

            if (passwordForm.newPassword) {
                if (passwordForm.newPassword !== passwordForm.confirmPassword) {
                    toast.error("Passwords do not match");
                    setIsLoading(false);
                    return;
                }
                formData.append('password', passwordForm.newPassword);
            }

            if (profileFile) {
                formData.append('profileImage', profileFile);
            }

            const { data } = await api.put('/auth/me', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                toast.success("Profile updated successfully!");
                setPasswordForm({ newPassword: "", confirmPassword: "" });
                onUpdate();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Merchant Profile</h2>
                    <p className="text-gray-500">Manage your personal information and payout settings.</p>
                </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-8">
                {/* Account Section */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <User className="w-5 h-5 text-primary-500" /> Personal Details
                    </h3>

                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="relative group mx-auto md:mx-0">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-50 shadow-md bg-gray-100 flex items-center justify-center">
                                {profileFile ? (
                                    <img src={URL.createObjectURL(profileFile)} className="w-full h-full object-cover" alt="Profile" />
                                ) : user?.profileImage ? (
                                    <img src={user.profileImage} className="w-full h-full object-cover" alt="Profile" />
                                ) : (
                                    <User className="w-12 h-12 text-gray-300" />
                                )}
                            </div>
                            <button
                                type="button"
                                onClick={() => document.getElementById('profile-upload')?.click()}
                                className="absolute bottom-0 right-0 bg-primary-600 text-white p-2.5 rounded-full shadow-lg hover:bg-primary-700 transition-all border-4 border-white"
                            >
                                <Camera className="w-4 h-4" />
                            </button>
                            <input id="profile-upload" type="file" className="sr-only" accept="image/*" onChange={e => e.target.files && setProfileFile(e.target.files[0])} />
                        </div>

                        <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input required type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Phone Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                    <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Password Section */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-primary-500" /> Security
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={passwordForm.newPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                    className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                                    placeholder="Leave blank to keep current"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirm New Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    value={passwordForm.confirmPassword}
                                    onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                    className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payout Section */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary-500" /> Payout Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Bank Name</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input type="text" value={form.payoutDetails.bankName} onChange={e => setForm({ ...form, payoutDetails: { ...form.payoutDetails, bankName: e.target.value } })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Holder Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input type="text" value={form.payoutDetails.accountHolderName} onChange={e => setForm({ ...form, payoutDetails: { ...form.payoutDetails, accountHolderName: e.target.value } })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Account Number</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input type="text" value={form.payoutDetails.accountNumber} onChange={e => setForm({ ...form, payoutDetails: { ...form.payoutDetails, accountNumber: e.target.value } })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">IFSC Code</label>
                            <div className="relative">
                                <Building className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                                <input type="text" value={form.payoutDetails.ifscCode} onChange={e => setForm({ ...form, payoutDetails: { ...form.payoutDetails, ifscCode: e.target.value } })} className="w-full pl-10 border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50/50" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center gap-2 bg-primary-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all disabled:opacity-50 hover:-translate-y-1"
                    >
                        <Save className="w-5 h-5" />
                        {isLoading ? "Updating..." : "Update Profile"}
                    </button>
                </div>
            </form>
        </div>
    );
}
