"use client";

import { Suspense, useState } from "react";
import api from "../../lib/api";
import { Lock, Store } from "lucide-react";
import toast from "react-hot-toast";
import { useSearchParams, useRouter } from "next/navigation";

function ResetPasswordForm() {
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            toast.error("Invalid token.");
            return;
        }

        if (password !== confirm) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return;
        }

        setIsLoading(true);
        try {
            const { data } = await api.put(`/auth/reset-password/${token}`, { password });
            if (data.success) {
                toast.success("Password secured! Welcome back.");
                setTimeout(() => {
                    // Navigate to appropriate login page depending on if customer or shop_owner. Default to login.
                    router.push("/login");
                }, 2000);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to submit request.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto flex justify-center w-fit p-3 bg-gray-200 rounded-full text-gray-700 mb-6 border border-gray-300">
                    <Store className="w-10 h-10" />
                </div>
                <h2 className="text-center text-3xl font-heading font-extrabold text-gray-900">
                    Enter New Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 px-4">
                    Make sure to secure it with at least 6 letters/numbers.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-500/5 sm:rounded-2xl sm:px-10 border border-gray-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 h-12 sm:text-sm border-gray-300 rounded-xl bg-gray-50 outline-none border focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={confirm}
                                    onChange={(e) => setConfirm(e.target.value)}
                                    className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 h-12 sm:text-sm border-gray-300 rounded-xl bg-gray-50 outline-none border focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all items-center gap-2"
                            >
                                {isLoading ? "Saving..." : "Change Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default function ResetPassword() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}
