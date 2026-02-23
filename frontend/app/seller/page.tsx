"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Store, Users, TrendingUp, ShieldCheck, Zap, Laptop, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import React from "react";

const SELLER_BENEFITS = [
    { id: "growth", name: "Local Growth", icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
    { id: "customers", name: "More Customers", icon: Users, color: "bg-green-100 text-green-600" },
    { id: "store", name: "Digital Storefront", icon: Store, color: "bg-purple-100 text-purple-600" },
    { id: "orders", name: "Manage Orders", icon: ShoppingBag, color: "bg-amber-100 text-amber-600" }
];

const PLATFORM_FEATURES = [
    { title: "Zero Setup Fees", desc: "Start your digital journey without any upfront costs.", icon: Zap },
    { title: "Real-time Analytics", desc: "Track your sales, popular products, and revenue directly.", icon: TrendingUp },
    { title: "24/7 Digital Presence", desc: "Your store never closes online. Gather orders overnight.", icon: Clock },
    { title: "Secure Payouts", desc: "Guaranteed protected transactions directly to your bank account.", icon: ShieldCheck }
];

export default function SellerHome() {
    return (
        <div className="bg-gray-50 flex flex-col w-full h-full min-h-screen pt-16 sm:pt-20 lg:pt-24">
            {/* Hero Section */}
            <section className="relative px-4 py-16 sm:py-24 lg:py-32 overflow-hidden bg-white w-full border-b border-gray-100 flex items-center justify-center text-center">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-gradient-to-br from-indigo-100/40 via-blue-50/40 to-white rounded-full blur-3xl opacity-80 -translate-x-1/3 -translate-y-1/3" />
                    <div className="absolute bottom-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-tr from-purple-100/40 via-pink-50/40 to-white rounded-full blur-3xl opacity-80 translate-x-1/3 translate-y-1/3" />
                </div>

                <div className="max-w-5xl mx-auto relative z-10 w-full">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[2rem] bg-indigo-50 text-indigo-700 font-bold text-xs sm:text-sm mb-6 sm:mb-8 border border-indigo-100 shadow-sm transition-transform hover:scale-105">
                            <Store className="w-4 h-4" />
                            <span>GoleMarket for Merchants</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-gray-900 tracking-tight leading-none mb-6">
                            Grow Your Local Business.<br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 py-2 inline-block">Digitally.</span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium">
                            Join hundreds of local vendors turning their physical storefronts into 24/7 digital powerhouses. Manage your inventory, track orders, and reach new customers today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
                            <Link href="/seller/register" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-lg">
                                Start Selling <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/seller/login" className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-2xl bg-white text-gray-900 font-bold border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
                                Merchant Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Benefits Highlights Section */}
            <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gray-50">
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-4 sm:mb-6 text-gray-900 tracking-tight">Why Sell With Us?</h2>
                    <p className="text-lg sm:text-xl text-gray-600 font-medium">
                        We provide everything you need to manage your business effectively online.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {SELLER_BENEFITS.map((sec, i) => {
                        const Icon = sec.icon;
                        return (
                            <motion.div
                                key={sec.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.4 }}
                                className="group p-6 sm:p-8 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 text-center flex flex-col items-center"
                            >
                                <div className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-2xl flex items-center justify-center ${sec.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{sec.name}</h3>
                            </motion.div>
                        )
                    })}
                </div>
            </section>

            {/* Trust & Platform Features Section */}
            <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 gap-4">
                    <div>
                        <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-gray-900 tracking-tight mb-3">Merchant Features</h2>
                        <p className="text-gray-600 font-medium text-lg">Built with robust tooling for local commerce.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {PLATFORM_FEATURES.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div key={i} className="text-left flex flex-col gap-5 p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-2">{feat.title}</h3>
                                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Onboarding CTA Section */}
            <section className="py-20 sm:py-24 px-4 relative overflow-hidden my-10 sm:my-20 mx-4 sm:mx-8 max-w-5xl lg:mx-auto rounded-[2.5rem] bg-gradient-to-br from-[#10132A] via-[#1a1438] to-[#10132A] shadow-xl">
                <div className="absolute inset-0">
                    <div className="absolute -top-40 right-1/4 w-96 h-96 bg-[#4f46e5] rounded-full blur-[100px] opacity-20" />
                    <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#9333ea] rounded-full blur-[100px] opacity-20" />
                </div>

                <div className="px-6 lg:px-12 mx-auto text-center text-white relative z-10 flex flex-col items-center">
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold mb-6 tracking-tight leading-tight max-w-2xl">
                        Start Your Journey Today
                    </h2>
                    <p className="text-gray-300 mb-10 text-lg leading-relaxed font-medium max-w-2xl">
                        Set up your digital store in minutes and unlock a whole new revenue stream for your business.
                    </p>

                    <Link href="/seller/register" className="inline-flex w-full sm:w-auto px-8 py-4 rounded-[1.2rem] bg-[#4f46e5] text-white font-bold hover:bg-[#4338ca] hover:shadow-lg active:scale-95 transition-all text-lg items-center justify-center gap-3">
                        <Store className="w-5 h-5" /> Create Merchant Account
                    </Link>
                </div>
            </section>

        </div>
    );
}
