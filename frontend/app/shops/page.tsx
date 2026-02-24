"use client";

import { useEffect, useState } from "react";
import api from "../../lib/api";
import { motion } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Star, Clock } from "lucide-react";
import { isStoreCurrentlyOpen } from "../../lib/storeUtils";

function ShopsListingContent() {
    const searchParams = useSearchParams();
    const initialSection = searchParams?.get('section') || "";

    const [shops, setShops] = useState([]);
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(initialSection);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchSections();
    }, []);

    useEffect(() => {
        const urlSection = searchParams?.get('section') || "";
        setSelectedSection(urlSection);
    }, [searchParams]);

    useEffect(() => {
        fetchShops();
    }, [selectedSection]);

    const fetchSections = async () => {
        try {
            const { data } = await api.get('/shops/sections');
            if (data.success) setSections(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchShops = async () => {
        setIsLoading(true);
        try {
            const url = selectedSection ? `/shops?section=${encodeURIComponent(selectedSection)}` : '/shops';
            const { data } = await api.get(url);
            if (data.success) setShops(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="mb-12">
                <h1 className="text-4xl font-heading font-extrabold text-gray-900 mb-4">
                    Explore Gole Market
                </h1>
                <p className="text-lg text-gray-600">Discover all 20+ authentic stores across 4 sections.</p>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-3 mt-8">
                    <button
                        onClick={() => setSelectedSection("")}
                        className={`px-6 py-2.5 rounded-full font-medium transition-all ${selectedSection === "" ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                    >
                        All Shops
                    </button>
                    {sections.map((sec: any) => (
                        <button
                            key={sec._id}
                            onClick={() => setSelectedSection(sec.name)}
                            className={`px-6 py-2.5 rounded-full font-medium transition-all ${selectedSection === sec.name ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                        >
                            {sec.name}
                        </button>
                    ))}
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                </div>
            ) : shops.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 text-lg">No shops found for this category.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {shops.map((shop: any, i) => {
                        const storeStatus = isStoreCurrentlyOpen(shop);
                        return (
                            <motion.div
                                key={shop._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group h-full relative ${!storeStatus.isOpen ? 'grayscale-[0.8] opacity-80' : ''}`}
                            >
                                {!storeStatus.isOpen && (
                                    <div className="absolute inset-0 z-20 bg-gray-900/10 pointer-events-none flex items-center justify-center">
                                        <div className="bg-gray-900/80 text-white px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm transform -rotate-12 border border-white/20">
                                            Currently Closed
                                        </div>
                                    </div>
                                )}
                                <div className="h-48 bg-gray-200 relative overflow-hidden">
                                    <img
                                        src={shop.logoImage || `https://via.placeholder.com/400?text=${shop.name}`}
                                        alt={shop.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {shop.rating.toFixed(1)}
                                    </div>
                                    <div className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 shadow-sm border ${storeStatus.isOpen ? 'bg-green-500 text-white border-green-400' : 'bg-red-500 text-white border-red-400'}`}>
                                        <div className={`w-1.5 h-1.5 rounded-full bg-white ${storeStatus.isOpen ? 'animate-pulse' : ''}`} />
                                        {storeStatus.isOpen ? 'Open Now' : 'Closed'}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                                            {shop.name}
                                        </h3>
                                        <span className="inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                                            {shop.section?.name || shop.shopType}
                                        </span>
                                        <p className="text-sm text-gray-500 mt-3 line-clamp-1">
                                            {shop.description}
                                        </p>
                                        {!storeStatus.isOpen && (
                                            <p className="text-[11px] font-bold text-red-600 mt-2 flex items-center gap-1">
                                                <Clock className="w-3 h-3" /> {storeStatus.message}
                                            </p>
                                        )}
                                    </div>
                                    <Link
                                        href={`/shops/${shop._id}`}
                                        className={`mt-6 w-full flex justify-between items-center py-2.5 px-4 rounded-xl font-semibold transition-all ${!storeStatus.isOpen ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-50 text-primary-700 hover:bg-primary-600 hover:text-white'}`}
                                    >
                                        {storeStatus.isOpen ? 'Enter Shop' : 'View Menu'} <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function ShopsListing() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-gray-50 py-12 flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>}>
            <ShopsListingContent />
        </Suspense>
    );
}
