"use client";

import { useState } from "react";
import api from "../../lib/api";
import { Mail, Store, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await api.post("/auth/forgot-password", { email });
            setIsSuccess(true);
            toast.success("Password reset link sent to your email!");
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

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
                        GoleCentral
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
                                    GoleCentral
                                </span>
                            </Link>
                        </div>
                        <h2 className="text-3xl font-heading font-extrabold text-gray-900 mb-2">
                            Reset Password
                        </h2>
                        <p className="text-gray-500">
                            Enter the email address tied to your account we will send you a reset link.
                        </p>
                    </div>

                    {isSuccess ? (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-green-800 mb-2">Check your email</h3>
                            <p className="text-green-700 mb-6">We have sent a password reset link to <span className="font-bold">{email}</span></p>
                            <Link href="/login" className="text-primary-600 font-bold hover:text-primary-700 underline underline-offset-4 decoration-primary-200 uppercase tracking-widest text-sm">
                                Return to login step
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 h-14 sm:text-sm border-gray-200 rounded-2xl bg-gray-50 outline-none border focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                        placeholder="you@email.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-14 flex justify-center py-2 px-4 border border-transparent rounded-2xl shadow-sm text-base font-bold text-white bg-gray-900 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all items-center gap-2 active:scale-[0.98]"
                            >
                                {isLoading ? "Sending Protocol..." : "Send Reset Link"}
                            </button>
                        </form>
                    )}

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
