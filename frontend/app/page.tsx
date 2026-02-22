"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Utensils, Zap, Laptop, Scissors } from "lucide-react";
import Link from "next/link";
import React from "react";

const SECTIONS = [
  { id: "food", name: "Food & Groceries", icon: Utensils, color: "bg-orange-100 text-orange-600" },
  { id: "electronics", name: "Electronics", icon: Laptop, color: "bg-blue-100 text-blue-600" },
  { id: "fashion", name: "Fashion", icon: ShoppingBag, color: "bg-pink-100 text-pink-600" },
  { id: "services", name: "Services", icon: Scissors, color: "bg-purple-100 text-purple-600" }
];

const MOCK_SHOPS = [
  { id: "1", name: "Sharma Sweets", type: "food", rating: 4.8, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1" },
  { id: "2", name: "Tech Guru", type: "electronics", rating: 4.5, image: "https://images.unsplash.com/photo-1550005972-eaffddbeaaab" },
  { id: "3", name: "Riya Boutique", type: "fashion", rating: 4.9, image: "https://images.unsplash.com/photo-1565084888279-aca607ecce0c" },
  { id: "4", name: "Gole Pharmacy", type: "services", rating: 4.7, image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Section */}
      <section className="relative px-4 py-20 lg:py-32 overflow-hidden bg-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-10 -left-10 w-72 h-72 bg-secondary-50 rounded-full blur-3xl opacity-60" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
              The Heart of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Gole Market</span><br /> Now Online.
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10">
              Shop from over 20+ authentic local stores, across 4 vibrant sections. Everything you love about Gole Market, delivered to your door.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="#explore" className="px-8 py-4 rounded-full bg-primary-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary-700 hover:shadow-lg hover:-translate-y-1 transition-all">
                Explore Shops <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sections */}
      <section id="explore" className="py-20 px-4 max-w-7xl mx-auto w-full">
        <h2 className="text-3xl font-heading font-bold mb-10 text-center">Browse by Section</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {SECTIONS.map((sec, i) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-3xl bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all cursor-pointer text-center"
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${sec.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-900">{sec.name}</h3>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* Popular Shops */}
      <section className="py-20 px-4 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-heading font-bold">Popular Shops</h2>
            <p className="text-gray-500 mt-2">Discover the top-rated local favorites</p>
          </div>
          <Link href="/shops" className="text-primary-600 font-semibold hover:underline flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {MOCK_SHOPS.map((shop, i) => (
            <motion.div
              key={shop.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 group cursor-pointer flex flex-col h-full"
            >
              <div className="h-48 overflow-hidden relative">
                <img src={shop.image} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  ⭐ {shop.rating}
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                    {shop.name}
                  </h3>
                  <p className="text-sm text-gray-500 capitalize mt-1">
                    {shop.type}
                  </p>
                </div>
                <Link href={`/shops/${shop.id}`} className="mt-4 w-full py-2 rounded-lg bg-gray-50 text-center font-medium hover:bg-primary-50 hover:text-primary-600 transition-colors">
                  Visit Store
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="bg-primary-600 py-20 px-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-5xl font-heading font-bold mb-6">Are you a Shop Owner?</h2>
          <p className="text-primary-100 mb-8 max-w-2xl mx-auto text-lg">
            Join Gole Market Hub and take your local business online. Manage inventory, receive orders, and grow your customer base with our unified platform.
          </p>
          <Link href="/seller/register" className="inline-block px-8 py-4 rounded-full bg-white text-primary-600 font-bold hover:shadow-lg hover:scale-105 transition-all">
            Join as Seller
          </Link>
        </div>
      </section>
    </div>
  );
}
