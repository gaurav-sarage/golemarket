"use client";

import { Suspense, useState } from "react";
import api from "../../lib/api";
import { Lock, Store, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const token = searchParams?.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid or missing reset token.");
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);

        try {
            const { data } = await api.put(`/auth/reset-password/${token}`, { password });
            toast.success("Password reset successfully! You can now login.");

            setTimeout(() => {
                if (data.user?.role === 'shop_owner') {
                    router.push("/seller/login");
                } else {
                    router.push("/login");
                }
            }, 2000);
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center py-6 px-4 border border-red-200 bg-red-50 text-red-600 rounded-2xl">
                <p className="font-bold">Missing reset token.</p>
                <p className="text-sm mt-1">Please ensure you copied the entire link from your email.</p>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 pr-12 h-14 sm:text-sm border-gray-200 rounded-2xl bg-gray-50 outline-none border focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 pr-12 h-14 sm:text-sm border-gray-200 rounded-2xl bg-gray-50 outline-none border focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                    >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 flex justify-center py-2 px-4 border border-transparent rounded-2xl shadow-sm text-base font-bold text-white bg-gray-900 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all items-center gap-2 active:scale-[0.98]"
            >
                {isLoading ? "Enabling Overrides..." : "Update Password Permanently"}
            </button>
        </form>
    );
}

export default function ResetPassword() {
    return (
        <div className="min-h-screen bg-white flex">
            {/* Left Panel - Image/Branding */}
            <div className="hidden lg:flex w-1/2 bg-gray-50 flex-col justify-between p-12 relative overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80"
                        alt="Marketplace Grocery"
                        className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                </div>

                <Link href="/" className="relative z-10 flex items-center gap-2 text-white group w-fit">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl group-hover:scale-105 transition-transform">
                        <Store className="h-6 w-6 text-white" />
                    </div>
                    <span className="font-heading font-extrabold text-2xl tracking-tight">
                        GoleMarket
                    </span>
                </Link>

                <div className="relative z-10 text-white max-w-md">
                    <h2 className="text-4xl font-heading font-bold mb-4 leading-tight">Delivering the neighborhood to your door.</h2>
                    <p className="text-gray-200 text-lg mb-8">Access thousands of local products, track your orders safely, and support your community.</p>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-8 sm:px-16 xl:px-24">
                <div className="w-full max-w-md mx-auto">
                    <div className="mb-10 text-center lg:text-left">
                        <div className="flex justify-center lg:hidden mb-8">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="p-2 bg-primary-100 rounded-xl">
                                    <Store className="h-6 w-6 text-primary-600" />
                                </div>
                                <span className="font-heading font-extrabold text-2xl tracking-tight text-gray-900">
                                    GoleMarket
                                </span>
                            </Link>
                        </div>
                        <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">
                            Secure New Password
                        </h2>
                        <p className="text-gray-500">
                            Almost there. Type in your brand new password below.
                        </p>
                    </div>

                    <Suspense fallback={
                        <div className="flex justify-center py-10">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        </div>
                    }>
                        <ResetPasswordForm />
                    </Suspense>

                    <div className="mt-10 pt-6 border-t border-gray-100 flex flex-col gap-4 text-center">
                        <Link href="/login" className="font-bold text-gray-600 hover:text-gray-900 transition-all">
                            Back to sign in page
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}