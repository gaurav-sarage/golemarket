"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Utensils, Zap, Laptop, Scissors, Store, Coffee, Car, ShieldCheck, Clock, CheckCircle, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import Link from "next/link";
import React, { useRef } from "react";

const CATEGORIES = [
  { id: "restaurants", name: "Restaurants", icon: Utensils, color: "bg-red-100 text-red-600" },
  { id: "grocery", name: "Grocery", icon: ShoppingBag, color: "bg-green-100 text-green-600" },
  { id: "cafes", name: "Cafes", icon: Coffee, color: "bg-amber-100 text-amber-600" },
  { id: "salons", name: "Salons", icon: Scissors, color: "bg-pink-100 text-pink-600" },
  { id: "auto", name: "Auto", icon: Car, color: "bg-blue-100 text-blue-600" },
  { id: "general", name: "General Stores", icon: Store, color: "bg-purple-100 text-purple-600" }
];

const TRUST_FEATURES = [
  { title: "Secure Payments", desc: "100% protected transactions via Razorpay.", icon: ShieldCheck },
  { title: "Fast Setup", desc: "Open your store online in under 5 minutes.", icon: Zap },
  { title: "Local Delivery", desc: "Get orders delivered quickly from nearby.", icon: Clock },
  { title: "Verified Shops", desc: "Every seller is vetted for authenticity.", icon: CheckCircle }
];

// Placeholder Data for UI Mockups
const FEATURED_SHOPS = [
  { id: 1, name: "FreshMart Groceries", category: "Grocery", rating: 4.8, img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=400" },
  { id: 2, name: "The Daily Grind Cafe", category: "Cafes", rating: 4.9, img: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&q=80&w=400" },
  { id: 3, name: "Elite Auto Care", category: "Auto", rating: 4.7, img: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=400" },
  { id: 4, name: "Style & Grace Salon", category: "Salons", rating: 4.6, img: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&q=80&w=400" },
  { id: 5, name: "City Market Goods", category: "General Stores", rating: 4.5, img: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=400" }
];

export default function Home() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-gray-50 flex flex-col w-full h-full min-h-screen pt-16 sm:pt-20 lg:pt-24">
      {/* Hero Section */}
      <section className="relative px-4 pt-8 pb-16 sm:pt-12 sm:pb-24 lg:pt-16 lg:pb-32 overflow-hidden bg-white w-full border-b border-gray-100 flex items-center justify-center text-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-gradient-to-br from-primary-100/40 via-secondary-50/40 to-white rounded-full blur-3xl opacity-80 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-tr from-secondary-100/40 via-primary-50/40 to-white rounded-full blur-3xl opacity-80 -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10 w-full">
          <motion.div
            initial={{ opacity: 0, rotateX: -25, y: 60, scale: 0.9 }}
            animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
            transition={{ duration: 1.2, type: "spring", bounce: 0.4 }}
            className="flex flex-col items-center"
            style={{ perspective: 1200 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-[2rem] bg-primary-50 text-primary-700 font-bold text-xs sm:text-sm mb-6 sm:mb-8 border border-primary-100 shadow-sm transition-transform hover:scale-105">
              <Store className="w-4 h-4" />
              <span>Next-Gen Local Discovery</span>
            </div>

            <motion.h1
              initial={{ opacity: 0, rotateY: 20 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ delay: 0.3, duration: 0.9, type: "spring" }}
              className="text-5xl sm:text-7xl md:text-8xl font-heading font-extrabold text-gray-900 tracking-tight leading-[1.05] mb-6"
            >
              Your Entire City.<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 py-2 inline-block drop-shadow-sm">In Your Pocket.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Step into the smart way to shop local. Instant access to the finest neighborhood merchants, curated exactly for you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="flex justify-center w-full px-4 sm:px-0"
            >
              <Link href="/shops" className="w-full sm:w-auto px-10 py-5 rounded-3xl bg-gray-900 text-white font-black flex items-center justify-center gap-3 hover:bg-gray-800 hover:shadow-2xl hover:shadow-gray-900/20 hover:-translate-y-1 transition-all active:scale-95 text-lg">
                Explore The Market <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Highlights Section */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-gray-50">
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-4 sm:mb-6 text-gray-900 tracking-tight">Browse Categories</h2>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            Jump securely into our curated hubs of local businesses.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {CATEGORIES.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Link href={`/shops?section=${encodeURIComponent(sec.name)}`} className="block group p-6 sm:p-8 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300 text-center flex flex-col items-center w-full h-full">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 rounded-2xl flex items-center justify-center ${sec.color} group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                    <Icon className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-tight">{sec.name}</h3>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How It Works (For Marketplace Clarity) */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-extrabold mb-4 sm:mb-6 text-gray-900 tracking-tight">How GoleCentral Works</h2>
          <p className="text-lg sm:text-xl text-gray-600 font-medium">
            Your neighborhood marketplace in 4 simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { step: '1', title: 'Browse Shops', desc: 'Find local favorites by category or location.', icon: Store },
            { step: '2', title: 'Add to Cart', desc: 'Select authentic product items to build your bag.', icon: ShoppingBag },
            { step: '3', title: 'Checkout', desc: 'Safely pay online through our secure gateway.', icon: ShieldCheck },
            { step: '4', title: 'Get Delivered', desc: 'Receive your items directly to your doorstep.', icon: MapPin }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative flex flex-col items-center text-center p-8 bg-white border border-gray-100 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-primary-100 relative">
                <item.icon className="w-8 h-8" />
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gray-900 text-white font-black text-sm rounded-full flex items-center justify-center shadow-md">
                  {item.step}
                </div>
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-500 font-medium leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>


    </div>
  );
}
