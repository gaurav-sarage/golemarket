"use client";

import { useState } from "react";
import { useAuthStore } from "../../../store/useAuthStore";
import api from "../../../lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Mail, Lock, Building, Phone, User } from "lucide-react";

export default function SellerRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const { data } = await api.post("/auth/shop-owner/register", { name, email, password, phone });
            if (data.success) {
                login(data.user);
                toast.success("Seller account created!");
                router.push("/seller/dashboard");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="mx-auto flex justify-center w-fit p-3 bg-secondary-100 rounded-full text-secondary-600 mb-6 border border-secondary-200">
                    <Building className="w-10 h-10" />
                </div>
                <h2 className="text-center text-3xl font-heading font-extrabold text-gray-900">
                    Become a Seller
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have a seller account?{" "}
                    <Link href="/seller/login" className="font-medium text-secondary-600 hover:text-secondary-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-secondary-500/5 sm:rounded-2xl sm:px-10 border border-secondary-100">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Owner Name</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="focus:ring-secondary-500 focus:border-secondary-500 block w-full pl-10 h-12 sm:text-sm border-gray-300 rounded-xl bg-gray-50 outline-none border focus:bg-white transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Business Email</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="focus:ring-secondary-500 focus:border-secondary-500 block w-full pl-10 h-12 sm:text-sm border-gray-300 rounded-xl bg-gray-50 outline-none border focus:bg-white transition-all"
                                    placeholder="shop@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="focus:ring-secondary-500 focus:border-secondary-500 block w-full pl-10 h-12 sm:text-sm border-gray-300 rounded-xl bg-gray-50 outline-none border focus:bg-white transition-all"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="focus:ring-secondary-500 focus:border-secondary-500 block w-full pl-10 h-12 sm:text-sm border-gray-300 rounded-xl bg-gray-50 outline-none border focus:bg-white transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 flex justify-center py-2 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500 transition-all items-center gap-2"
                            >
                                {isLoading ? "Creating..." : "Create Seller Account"}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 border-t border-gray-100 pt-6">
                        <Link href="/register" className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-xl text-primary-700 bg-primary-50 hover:bg-primary-100 transition-colors">
                            I'm a Customer
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
