"use client";

import { motion } from "framer-motion";
import { Store, Users, MapPin, ShieldCheck, Heart, Leaf } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20 pt-16 sm:pt-24 lg:pt-28">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
                    className="text-center max-w-4xl mx-auto mb-20 sm:mb-28 mt-8 sm:mt-12"
                >
                    <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary-100 rounded-3xl mb-8">
                        <Store className="w-8 h-8 sm:w-10 sm:h-10 text-primary-600" />
                    </div>
                    <h1 className="text-4xl sm:text-6xl md:text-7xl font-heading font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                        Revitalizing <span className="text-primary-600">Local Commerce.</span>
                    </h1>
                    <p className="text-lg sm:text-2xl text-slate-600 font-medium max-w-3xl mx-auto leading-relaxed">
                        GoleCentral is on a mission to democratize digital retail. We empower neighborhood shops
                        to thrive online while providing customers with authentic, high-quality local goods instantly.
                    </p>
                </motion.div>

                {/* Values Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 lg:mb-32">
                    {[
                        { icon: Users, title: "Community First", color: "bg-blue-100 text-blue-600", border: "hover:border-blue-200", desc: "We prioritize local merchants, ensuring your money stays within your community." },
                        { icon: ShieldCheck, title: "Uncompromising Trust", color: "bg-green-100 text-green-600", border: "hover:border-green-200", desc: "100% genuine sellers. Every transaction is encrypted and secured by modern web standards." },
                        { icon: MapPin, title: "Hyper-Local Delivery", color: "bg-pink-100 text-pink-600", border: "hover:border-pink-200", desc: "By narrowing our radius, we guarantee faster deliveries and fresher items." },
                        { icon: Heart, title: "Empowering Merchants", color: "bg-red-100 text-red-600", border: "hover:border-red-200", desc: "We provide small businesses with enterprise-grade tech without the enterprise hassle." },
                        { icon: Leaf, title: "Sustainable Shopping", color: "bg-emerald-100 text-emerald-600", border: "hover:border-emerald-200", desc: "Less transit distance means a greatly reduced carbon footprint with every order." },
                        { icon: Store, title: "Authentic Goods", color: "bg-purple-100 text-purple-600", border: "hover:border-purple-200", desc: "Skip the gigantic nameless warehouses. Buy directly from people you know." }
                    ].map((val, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className={`p-8 bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 ${val.border}`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${val.color}`}>
                                <val.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">{val.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{val.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Story Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[3rem] p-8 sm:p-12 lg:p-16 border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center gap-12 lg:gap-20 overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-primary-50/50 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="w-full lg:w-1/2 relative z-10">
                        <div className="inline-flex px-4 py-1.5 bg-primary-50 text-primary-700 font-bold text-sm tracking-widest uppercase rounded-full mb-6 border border-primary-100">
                            Our Story
                        </div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold text-slate-900 leading-tight mb-6">
                            Bridging the digital divide for local stores.
                        </h2>
                        <div className="space-y-6 text-lg text-slate-600 font-medium">
                            <p>
                                The internet accelerated big box retailers perfectly, but left the neighborhood mom & pop shop behind. Setting up complicated digital infrastructures, managing massive commission chunks, and running isolated websites proved too high a barrier.
                            </p>
                            <p>
                                GoleCentral was built with a singular premise: What if your favorite corner cafe, local grocer, and boutique salon could all exist on one seamless platform with zero technical overhead?
                            </p>
                            <p>
                                Today, we are proud to host hundreds of dedicated local storefronts, giving them infinite scalability, while granting customers an uncompromisingly beautiful and secure digital shopping experience.
                            </p>
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 relative z-10">
                        <div className="aspect-square bg-slate-100 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80" alt="Local store" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                            <div className="absolute bottom-8 left-8 right-8 text-white">
                                <p className="font-bold text-xl leading-tight opacity-90">"GoleCentral brought my 30-year-old family grocery online in under 10 minutes. It changed everything."</p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Final CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="mt-20 sm:mt-32 text-center"
                >
                    <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-slate-900 mb-8">Ready to join the local revolution?</h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/shops" className="inline-flex px-8 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 hover:shadow-lg transition-all active:scale-95 text-lg justify-center items-center">
                            Start Shopping
                        </Link>
                        <Link href="/seller/register" className="inline-flex px-8 py-4 bg-white text-slate-900 border-2 border-slate-200 font-bold rounded-xl hover:border-slate-300 hover:bg-slate-50 transition-all active:scale-95 text-lg justify-center items-center">
                            Become a Partner
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
