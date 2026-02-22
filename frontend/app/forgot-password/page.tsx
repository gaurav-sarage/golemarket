"use client";

import { useState } from "react";
import api from "../../lib/api";
import { Mail, Store } from "lucide-react";
import toast from "react-hot-toast";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post("/auth/forgot-password", { email });
            if (data.success) {
                toast.success("Validation sent successfully!");
                setIsSent(true);
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
                    Recover Password
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 px-4">
                    {!isSent ? "Enter your email address and we'll send you a link to get back into your account." : "Please check your inbox."}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-gray-500/5 sm:rounded-2xl sm:px-10 border border-gray-100">
                    {!isSent ? (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email account</label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 h-12 sm:text-sm border-gray-300 rounded-xl bg-gray-50 outline-none border focus:bg-white transition-all"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full h-12 flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all items-center gap-2"
                                >
                                    {isLoading ? "Sending..." : "Send Reset Link"}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Mail className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Check your email</h3>
                            <p className="text-gray-500 mb-8">
                                We sent a password recovery link to you. It will expire in exactly 10 minutes.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
