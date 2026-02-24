"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Store, Mail, MapPin, Phone, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import api from "../lib/api";

export default function Footer() {
    const [sections, setSections] = useState<{ _id: string, name: string }[]>([]);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const { data } = await api.get('/shops/sections');
                if (data.success) {
                    setSections(data.data.slice(0, 5)); // Limit to 5 for footer
                }
            } catch (err) {
                console.error("Failed to fetch footer sections", err);
            }
        };
        fetchSections();
    }, []);

    return (
        <footer className="bg-white border-t border-gray-100 pt-20 mt-auto overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-20">

                    {/* Brand Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 flex flex-col gap-6"
                    >
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="p-2.5 bg-primary-100 rounded-2xl group-hover:bg-primary-600 group-hover:rotate-12 transition-all duration-300">
                                <Store className="h-7 w-7 text-primary-600 group-hover:text-white transition-colors" />
                            </div>
                            <span className="font-heading font-black text-3xl tracking-tight text-gray-900">
                                GoleMarket
                            </span>
                        </Link>
                        <p className="text-gray-500 font-medium leading-relaxed max-w-sm text-lg">
                            Empowering local neighborhood commerce through a unified digital marketplace. Shop smart, shop local.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram].map((Icon, i) => (
                                <a key={i} href="#" className="w-11 h-11 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 hover:text-primary-600 hover:bg-primary-50 hover:-translate-y-1 transition-all">
                                    <Icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="font-black text-gray-900 mb-8 text-xs uppercase tracking-[0.2em]">Company</h3>
                        <ul className="space-y-4">
                            {['About Us', 'Browse Shops', 'Privacy Policy', 'Terms of Service'].map((link) => (
                                <li key={link}>
                                    <Link
                                        href={link === 'About Us' ? '/about' : link === 'Browse Shops' ? '/shops' : '#'}
                                        className="text-gray-500 font-bold hover:text-primary-600 transition-colors flex items-center gap-2 group"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Categories/Sections Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="font-black text-gray-900 mb-8 text-xs uppercase tracking-[0.2em]">Categories</h3>
                        <ul className="space-y-4">
                            {sections.length > 0 ? sections.map((section) => (
                                <li key={section._id}>
                                    <Link
                                        href={`/shops?section=${section._id}`}
                                        className="text-gray-500 font-bold hover:text-primary-600 transition-colors flex items-center gap-2 group capitalize"
                                    >
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                        {section.name}
                                    </Link>
                                </li>
                            )) : ['Restaurants', 'Grocery', 'Fashion', 'Electronics'].map((cat) => (
                                <li key={cat}>
                                    <Link href="/shops" className="text-gray-500 font-bold hover:text-primary-600 transition-colors flex items-center gap-2 group">
                                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                        {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Support Column */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <h3 className="font-black text-gray-900 mb-8 text-xs uppercase tracking-[0.2em]">Support</h3>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Email us</p>
                                    <p className="text-gray-900 font-bold text-sm">hello@golemarket.com</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                                    <Phone className="w-5 h-5 text-gray-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Call us</p>
                                    <p className="text-gray-900 font-bold text-sm">+91 1800 123 456</p>
                                </div>
                            </li>
                        </ul>
                    </motion.div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-100 py-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 font-bold text-sm tracking-wide">
                        &copy; {new Date().getFullYear()} GoleMarket Hub. Handcrafted with precision.
                    </p>
                    <div className="flex items-center gap-8">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" alt="Razorpay" className="h-5 opacity-40 grayscale hover:grayscale-0 transition-all cursor-pointer" />
                        <div className="flex gap-6 text-sm font-bold text-gray-400">
                            <a href="#" className="hover:text-gray-900 transition-colors">Privacy</a>
                            <a href="#" className="hover:text-gray-900 transition-colors">Terms</a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
