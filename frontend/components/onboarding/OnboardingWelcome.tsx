"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ShoppingBag, Store, Zap, Sparkles, ArrowRight, Mail } from "lucide-react";
import { useState, useEffect } from "react";

interface OnboardingWelcomeProps {
    type: 'customer' | 'seller';
    name: string;
    onComplete: () => void;
}

export default function OnboardingWelcome({ type, name, onComplete }: OnboardingWelcomeProps) {
    const [step, setStep] = useState(0);

    const sellerSteps = [
        {
            title: "Welcome to Gole Market Hub!",
            description: "Your digital journey starts here. We're excited to help you scale your business.",
            icon: <Store className="w-8 h-8 text-primary-500" />,
            color: "bg-primary-50"
        },
        {
            title: "Configure your Store",
            description: "Set your business hours, upload your logo, and define your delivery zones in settings.",
            icon: <Zap className="w-8 h-8 text-yellow-500" />,
            color: "bg-yellow-50"
        },
        {
            title: "Start Selling",
            description: "Add your first product and start receiving orders from local customers instantly.",
            icon: <Sparkles className="w-8 h-8 text-purple-500" />,
            color: "bg-purple-50"
        }
    ];

    const customerSteps = [
        {
            title: "Welcome to the Marketplace!",
            description: "Discover the best local shops and authentic products at Gole Market.",
            icon: <ShoppingBag className="w-8 h-8 text-primary-500" />,
            color: "bg-primary-50"
        },
        {
            title: "Fast Local Delivery",
            description: "Get items delivered from your favorite stores directly to your doorstep.",
            icon: <Zap className="w-8 h-8 text-blue-500" />,
            color: "bg-blue-50"
        },
        {
            title: "Exclusive Offers",
            description: "Enjoy special discounts and priority support as a premium member.",
            icon: <Sparkles className="w-8 h-8 text-pink-500" />,
            color: "bg-pink-50"
        }
    ];

    const activeSteps = type === 'seller' ? sellerSteps : customerSteps;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white w-full max-w-lg rounded-[48px] overflow-hidden shadow-2xl border border-white"
            >
                {/* Simulated Email Header */}
                <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                            <Mail className="w-5 h-5 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">New message from</p>
                            <p className="text-sm font-black text-gray-900">Gole Market Hub</p>
                        </div>
                    </div>
                </div>

                <div className="p-10 text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="flex flex-col items-center"
                        >
                            <div className={`w-20 h-20 rounded-[32px] ${activeSteps[step].color} flex items-center justify-center mb-8 shadow-inner`}>
                                {activeSteps[step].icon}
                            </div>

                            <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
                                {activeSteps[step].title}
                            </h2>
                            <p className="text-gray-500 font-bold leading-relaxed mb-10 max-w-[280px]">
                                {activeSteps[step].description}
                            </p>
                        </motion.div>
                    </AnimatePresence>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-10">
                        {activeSteps.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-8 bg-primary-600' : 'w-1.5 bg-gray-100'}`}
                            />
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            if (step < activeSteps.length - 1) {
                                setStep(step + 1);
                            } else {
                                onComplete();
                            }
                        }}
                        className="w-full bg-gray-900 text-white py-5 rounded-[24px] font-black text-sm tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-900/20 group active:scale-[0.98]"
                    >
                        {step === activeSteps.length - 1 ? "LET'S BEGIN" : "CONTINUE"}
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button
                        onClick={onComplete}
                        className="mt-6 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors"
                    >
                        Skip Onboarding
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
