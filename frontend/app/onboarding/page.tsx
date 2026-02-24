"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../../store/useAuthStore";
import { ArrowRight, User as UserIcon, Store as StoreIcon, Sparkles } from "lucide-react";
import Link from "next/link";

export default function OnboardingPage() {
    const { user } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // If no user is logged in, redirect to login
        if (!user && mounted) {
            router.push("/login");
        }
    }, [user, router, mounted]);

    if (!user) return null;

    const isMerchant = user.role === "shop_owner" || user.role === "admin";

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring" as const,
                damping: 20,
                stiffness: 100,
                duration: 0.6
            }
        }
    };

    const floatingVariants = {
        animate: {
            y: [0, -20, 0],
            rotate: [0, 5, -5, 0],
            transition: {
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut" as const
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full bg-[#fdfdfd] overflow-hidden flex items-center justify-center p-6">
            {/* Soft Gradient Background Animation */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary-100/40 rounded-full blur-[120px]"
                />
            </div>

            {/* Floating Shapes for Depth */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    variants={floatingVariants}
                    animate="animate"
                    className="absolute top-[15%] right-[10%] w-12 h-12 bg-white rounded-2xl shadow-xl shadow-blue-500/5 flex items-center justify-center -rotate-12"
                >
                    <Sparkles className="w-6 h-6 text-primary-400" />
                </motion.div>
                <motion.div
                    animate={{
                        y: [0, 25, 0],
                        rotate: [0, -10, 10, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute bottom-[20%] left-[12%] w-16 h-16 bg-white rounded-3xl shadow-xl shadow-primary-500/5 flex items-center justify-center rotate-12"
                >
                    <div className="w-8 h-8 rounded-full bg-primary-50" />
                </motion.div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="relative z-10 w-full max-w-2xl text-center"
            >
                {/* Icon/Brand Mark */}
                <motion.div variants={itemVariants} className="mb-12 flex justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary-600 rounded-[2rem] blur-2xl opacity-20 animate-pulse" />
                        <div className="relative w-24 h-24 bg-white rounded-[2rem] shadow-2xl shadow-primary-600/10 border border-gray-50 flex items-center justify-center">
                            {isMerchant ? (
                                <StoreIcon className="w-10 h-10 text-primary-600" />
                            ) : (
                                <UserIcon className="w-10 h-10 text-primary-600" />
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Heading */}
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6 leading-[1.1]"
                >
                    {isMerchant ? (
                        <>Welcome back, Partner! <br className="hidden md:block" /> <span className="text-primary-600">{user.name}</span> 🚀</>
                    ) : (
                        <>Welcome to GoleMarket, <br className="hidden md:block" /> <span className="text-primary-600">{user.name}</span> 👋</>
                    )}
                </motion.h1>

                {/* Subtext */}
                <motion.p
                    variants={itemVariants}
                    className="text-lg md:text-xl text-gray-500 font-medium max-w-lg mx-auto mb-12 leading-relaxed px-4"
                >
                    {isMerchant ? (
                        "Empower your local business with GoleMarket. Reach more customers, manage inventory, and grow your shop with our advanced merchant tools."
                    ) : (
                        "Your one-stop destination for local shopping. Discover unique products from nearby shops and support your local marketplace community."
                    )}
                </motion.p>

                {/* CTAs */}
                <motion.div variants={itemVariants} className="flex flex-col items-center gap-6 px-4">
                    <Link
                        href={isMerchant ? "/seller/dashboard" : "/shops"}
                        className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-4 px-8 md:px-12 py-5 md:py-6 bg-primary-600 text-white font-black text-xl md:text-2xl rounded-[2.5rem] shadow-2xl shadow-primary-600/30 hover:bg-primary-700 hover:-translate-y-1 active:scale-95 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                        <span className="relative">
                            {isMerchant ? "Set Up Your Store" : "Start Exploring"}
                        </span>
                        <ArrowRight className="relative w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </Link>

                    <Link
                        href={isMerchant ? "/seller/settings" : "/profile"}
                        className="text-gray-400 font-bold text-lg hover:text-primary-600 transition-colors py-2"
                    >
                        {isMerchant ? "Complete Shop Details" : "Complete Profile"}
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
