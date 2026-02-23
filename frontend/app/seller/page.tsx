"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Store, Users, TrendingUp, ShieldCheck, Zap, Laptop, Clock, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

const WHY_GOLECENTRAL = [
    { id: 1, title: "Reach Thousands Locally", desc: "Instantly connect with customers actively shopping in your city.", img: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "Seamless Order Management", desc: "A powerful dashboard to receive, track, and fulfill orders with ease.", img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600" },
    { id: 3, title: "Zero Technical Hassle", desc: "We handle the hosting, payments, and security. You focus on selling.", img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=600" },
    { id: 4, title: "Direct Bank Payouts", desc: "Secure Razorpay integrations meaning you get paid reliably and quickly.", img: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=600" },
    { id: 5, title: "Dedicated Support", desc: "Our merchant success team is here to help you scale your operations.", img: "https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&q=80&w=600" }
];

const PLATFORM_FEATURES = [
    { title: "Zero Setup Fees", desc: "Start your digital journey without any upfront costs.", icon: Zap },
    { title: "Real-time Analytics", desc: "Track your sales, popular products, and revenue directly.", icon: TrendingUp },
    { title: "24/7 Digital Presence", desc: "Your store never closes online. Gather orders overnight.", icon: Clock },
    { title: "Secure Payouts", desc: "Guaranteed protected transactions directly to your bank account.", icon: ShieldCheck }
];

export default function SellerHome() {
    const carouselRef = useRef<HTMLDivElement>(null);

    const scrollLeft = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: -350, behavior: 'smooth' });
        }
    };

    const scrollRight = () => {
        if (carouselRef.current) {
            carouselRef.current.scrollBy({ left: 350, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-slate-50 flex flex-col w-full h-full min-h-screen pt-16 sm:pt-20 lg:pt-24 font-sans">

            {/* 1. Hero Section */}
            <section className="relative px-4 py-16 sm:py-24 lg:py-32 overflow-hidden bg-white w-full border-b border-slate-100 flex items-center justify-center text-center">
                <div className="absolute inset-0 z-0 pointer-events-none">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[2rem] bg-indigo-50 text-indigo-700 font-bold text-xs sm:text-sm mb-6 sm:mb-8 border border-indigo-100 shadow-sm">
                            <Store className="w-4 h-4" />
                            <span>GoleMarket for Merchants</span>
                        </div>

                        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-heading font-extrabold text-slate-900 tracking-tight leading-none mb-6">
                            Grow Your Local Business.<br className="hidden sm:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-500 py-2 inline-block">Digitally.</span>
                        </h1>

                        <p className="text-base sm:text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                            Join hundreds of local vendors turning their physical storefronts into 24/7 digital powerhouses. Manage your inventory, track orders, and reach new customers today.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto px-4 sm:px-0">
                            <Link href="/seller/register" className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-lg">
                                Create Account <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link href="/seller/login" className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold border-2 border-slate-200 hover:border-indigo-600 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
                                Merchant Login
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* 2. Carousel: Why GoleCentral */}
            <section className="py-20 sm:py-24 pl-4 sm:pl-6 lg:pl-8 lg:pr-8 mx-auto w-full overflow-hidden max-w-[1400px]">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 sm:mb-12 gap-4 max-w-7xl mx-auto px-4 sm:px-0">
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-900 tracking-tight mb-3">Why GoleCentral?</h2>
                        <p className="text-slate-600 font-medium text-lg">Everything you need to succeed in the modern local economy.</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2">
                        <button onClick={scrollLeft} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm focus:outline-none active:scale-95">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={scrollRight} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm focus:outline-none active:scale-95">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar mx-auto max-w-7xl px-4 sm:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {WHY_GOLECENTRAL.map((item) => (
                        <div key={item.id} className="min-w-[300px] sm:min-w-[350px] bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col snap-center group">
                            <div className="h-56 overflow-hidden relative">
                                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                                <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            </div>
                            <div className="p-8 flex flex-col flex-grow bg-white relative z-20">
                                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 -mt-14 relative z-30 border-4 border-white shadow-sm">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-xl text-slate-900 mb-3 leading-tight">{item.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* 3. CTA Section Mid-Page */}
            <section className="py-16 px-4">
                <div className="max-w-5xl mx-auto bg-indigo-600 rounded-[2.5rem] p-10 sm:p-16 text-center shadow-xl shadow-indigo-600/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white mb-6 tracking-tight">Ready to boost your sales?</h2>
                        <p className="text-indigo-100 text-lg sm:text-xl font-medium mb-10 max-w-2xl">Join the fastest growing network of local businesses. Sign up is free, setup takes minutes.</p>
                        <Link href="/seller/register" className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 hover:shadow-lg hover:scale-105 transition-all shadow-sm active:scale-95">
                            Register as Seller
                        </Link>
                    </div>
                </div>
            </section>

            {/* 4. Features Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 tracking-tight mb-4">Platform Features</h2>
                    <p className="text-slate-600 font-medium text-lg">Built with robust tooling for local commerce.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                    {PLATFORM_FEATURES.map((feat, i) => {
                        const Icon = feat.icon;
                        return (
                            <div key={i} className="text-left flex flex-col gap-5 p-8 bg-white border border-slate-100 rounded-[2rem] shadow-sm hover:shadow-md hover:border-indigo-100 transition-all">
                                <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <Icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">{feat.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{feat.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* 5. Footer */}
            <footer className="bg-slate-900 py-12 px-6 mt-auto">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <Store className="text-indigo-500 w-6 h-6" />
                        <span className="text-white font-extrabold text-xl tracking-tight">GoleMarket <span className="text-slate-400 font-medium text-lg">Merchant</span></span>
                    </div>
                    <div className="text-slate-400 text-sm font-medium">
                        © 2026 GoleCentral Technologies. All rights reserved.
                    </div>
                </div>
            </footer>

        </div>
    );
}
