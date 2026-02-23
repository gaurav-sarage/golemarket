"use client";

import { useState } from "react";
import api from "../../lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { Store, Mail, Lock, User, Phone, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const name = `${firstName} ${lastName}`.trim();
            const { data } = await api.post("/auth/user/register", { name, email, password, phone });
            if (data.success) {
                toast.success("Account created successfully! Please verify your email to login.", { duration: 6000 });
                router.push("/login");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Registration failed");
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
                    <h2 className="text-4xl font-heading font-bold mb-4 leading-tight">Join the neighborhood.</h2>
                    <p className="text-gray-200 text-lg mb-8">Create an account to discover your favorite local stores and fresh produce without leaving home.</p>

                    <div className="flex gap-4 items-center">
                        <Link href="/shops" className="text-white hover:text-primary-300 font-bold flex items-center gap-2 group transition-colors">
                            Explore Shops <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Panel - Register Form */}
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
                            Create an Account
                        </h2>
                        <p className="text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="font-bold text-primary-600 hover:text-primary-500 underline decoration-primary-600/30 underline-offset-4 transition-all">
                                Sign in instead
                            </Link>
                        </p>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <User className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 h-14 sm:text-sm border-gray-200 rounded-2xl bg-gray-50 outline-none border focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                        placeholder="John"
                                    />
                                </div>
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full px-4 h-14 sm:text-sm border-gray-200 rounded-2xl bg-gray-50 outline-none border focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>
                        </div>

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

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="tel"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="focus:ring-2 focus:ring-primary-500 focus:border-primary-500 block w-full pl-12 h-14 sm:text-sm border-gray-200 rounded-2xl bg-gray-50 outline-none border focus:bg-white transition-all font-medium text-gray-900 placeholder-gray-400 shadow-sm"
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
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
                            <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                            className="w-full h-14 flex justify-center py-2 px-4 border border-transparent rounded-2xl shadow-sm text-base font-bold text-white bg-gray-900 hover:bg-gray-800 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-all items-center gap-2 active:scale-[0.98] mt-4"
                        >
                            {isLoading ? "Creating Account..." : "Sign Up Securely"}
                        </button>
                    </form>


                </div>
            </div>
        </div>
    );
}
