"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Utensils, Zap, Laptop, Scissors, Store } from "lucide-react";
import Link from "next/link";
import React from "react";

const SECTIONS = [
  { id: "food", name: "Food & Groceries", icon: Utensils, color: "bg-orange-100 text-orange-600" },
  { id: "electronics", name: "Electronics", icon: Laptop, color: "bg-blue-100 text-blue-600" },
  { id: "fashion", name: "Fashion", icon: ShoppingBag, color: "bg-pink-100 text-pink-600" },
  { id: "services", name: "Services", icon: Scissors, color: "bg-purple-100 text-purple-600" }
];

export default function Home() {
  return (
    <div className="bg-gray-50 flex flex-col w-full h-full">
      {/* Hero Section */}
      <section className="relative px-4 py-20 lg:py-32 overflow-hidden bg-white w-full border-b border-gray-100">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-br from-primary-100/40 via-secondary-50/40 to-white rounded-full blur-3xl opacity-80 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-secondary-100/40 via-primary-50/40 to-white rounded-full blur-3xl opacity-80 -translate-x-1/3 translate-y-1/3" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 text-primary-700 font-medium text-sm mb-6 border border-primary-100 shadow-sm">
                <Store className="w-4 h-4" />
                <span>The Future of Local Commerce</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">GoleCentral</span>
              </h1>

              <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-xl mx-auto lg:mx-0">
                Experience the magic of your community marketplace, completely reimagined. Shop thousands of unique products from verified local sellers, anywhere, anytime.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/shops" className="px-8 py-4 rounded-2xl bg-gray-900 text-white font-bold flex items-center justify-center gap-2 hover:bg-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 text-lg">
                  Explore Shops Now <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/seller/register" className="px-8 py-4 rounded-2xl bg-white text-gray-900 font-bold border-2 border-gray-100 hover:border-gray-200 hover:shadow-md transition-all active:scale-95 text-lg flex items-center justify-center gap-2">
                  Open Your Shop in Minutes
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1"
                  alt="Marketplace Platform"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <h3 className="text-2xl font-bold mb-2">Authentic Goodness</h3>
                    <p className="text-gray-100/90 font-medium text-lg">Discover the best local vendors.</p>
                  </div>
                </div>
              </div>

              {/* Floating Element */}
              <div className="absolute top-10 -left-12 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce hover:scale-105 transition-transform cursor-pointer border border-gray-100">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Recent Order</p>
                  <p className="font-bold text-gray-900">Delivered securely!</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="explore" className="py-24 px-4 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-heading font-extrabold mb-6 text-gray-900">Explore Categories</h2>
          <p className="text-xl text-gray-600">
            Dive into our curated marketplace hubs. Find exactly what you need, exactly when you need it.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative p-8 rounded-[2rem] bg-white shadow-sm border border-gray-100 hover:shadow-2xl hover:border-primary-100 transition-all duration-300 cursor-pointer text-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className={`relative z-10 w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center ${sec.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm`}>
                  <Icon className="w-10 h-10" />
                </div>

                <h3 className="relative z-10 text-xl font-bold text-gray-900 mb-2">{sec.name}</h3>
                <p className="relative z-10 text-gray-500 text-sm font-medium">View Collections &rarr;</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -top-40 right-1/4 w-96 h-96 bg-primary-600 rounded-full blur-[100px] opacity-20" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-secondary-500 rounded-full blur-[100px] opacity-20" />
        </div>

        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-4xl md:text-6xl font-heading font-extrabold mb-8 leading-tight">Join the GoleCentral Ecosystem</h2>
          <p className="text-gray-400 mb-12 max-w-2xl mx-auto text-xl leading-relaxed">
            Whether you are looking to shop locally with zero hassle, or looking to scale your local brick-and-mortar digitally, we have crafted the perfect platform for you.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/register" className="px-8 py-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-500 hover:shadow-lg hover:shadow-primary-500/20 active:scale-95 transition-all text-lg">
              Sign Up as Customer
            </Link>
            <Link href="/seller/register" className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-sm active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
              <Store className="w-5 h-5" /> Start Selling
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
