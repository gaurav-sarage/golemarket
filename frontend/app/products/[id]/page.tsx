"use client";

import { useEffect, useState, use } from "react";
import api from "../../../lib/api";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail, ShoppingCart, ArrowLeft, ShieldCheck, Truck, Clock, Tag } from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const router = useRouter();

    const [product, setProduct] = useState<any>(null);
    const [shop, setShop] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const { addToCart } = useCartStore();

    useEffect(() => {
        fetchProductDetails();
    }, [id]);

    const fetchProductDetails = async () => {
        try {
            const { data } = await api.get(`/products/${id}`);
            if (data.success) {
                setProduct(data.data);
                if (data.data.shopId) {
                    fetchShopDetails(data.data.shopId);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchShopDetails = async (shopId: string) => {
        try {
            const idVal = typeof shopId === 'object' ? (shopId as any)._id : shopId;
            const { data } = await api.get(`/shops/${idVal}`);
            if (data.success) setShop(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToCart = async () => {
        const success = await addToCart(product._id, 1);
        if (success) {
            toast.success(`${product.name} added to cart!`);
        } else {
            toast.error("Failed to add to cart. Please log in first.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <p className="text-xl text-gray-500 font-medium">Product not found.</p>
                <button onClick={() => router.back()} className="text-primary-600 font-bold hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-500 hover:text-primary-600 font-bold mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Shop
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm p-8 sm:p-12 flex items-center justify-center min-h-[400px] lg:min-h-[600px] relative"
                    >
                        <img
                            src={product.images?.[0] || "https://via.placeholder.com/600?text=No+Image"}
                            alt={product.name}
                            className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-700"
                        />
                        {product.stockQuantity < 5 && product.stockQuantity > 0 && (
                            <div className="absolute top-8 left-8 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                Limited Stock: {product.stockQuantity} left
                            </div>
                        )}
                        {product.stockQuantity === 0 && (
                            <div className="absolute top-8 left-8 bg-gray-900 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
                                Currently Out of Stock
                            </div>
                        )}
                    </motion.div>

                    {/* Right Column: Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col"
                    >
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm p-8 sm:p-10 flex-1">
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider">
                                    {product.categoryName || 'General'}
                                </span>
                                {product.foodCategory && (
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${product.foodCategory === 'Veg' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                                        {product.foodCategory}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-heading font-extrabold text-gray-900 mb-4 leading-tight">
                                {product.name}
                            </h1>

                            <div className="flex items-baseline gap-4 mb-8">
                                <span className="text-4xl font-black text-primary-600">₹{product.price}</span>
                                {product.salePrice && product.salePrice < product.price && (
                                    <span className="text-xl text-gray-400 line-through font-medium">₹{product.salePrice}</span>
                                )}
                            </div>

                            <p className="text-lg text-gray-600 leading-relaxed mb-10 pb-8 border-b border-gray-50">
                                {product.description}
                            </p>

                            <div className="grid grid-cols-2 gap-6 mb-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Quality</p>
                                        <p className="text-sm font-bold text-gray-900">Verified</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                        <Truck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Delivery</p>
                                        <p className="text-sm font-bold text-gray-900">{product.deliveryEligibility ? 'Available' : 'No'}</p>
                                    </div>
                                </div>
                                {product.preparationTime && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wait Time</p>
                                            <p className="text-sm font-bold text-gray-900">{product.preparationTime} mins</p>
                                        </div>
                                    </div>
                                )}
                                {product.portionSize && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Size</p>
                                            <p className="text-sm font-bold text-gray-900">{product.portionSize}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={product.stockQuantity === 0}
                                className={`w-full py-5 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary-500/10 active:scale-95 ${product.stockQuantity === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-1'
                                    }`}
                            >
                                <ShoppingCart className="w-6 h-6" />
                                {product.stockQuantity === 0 ? "Currently Unavailable" : "Add to Shopping Bag"}
                            </button>
                        </div>

                        {/* Shop Info Card */}
                        {shop && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="mt-6 bg-secondary-900 text-white rounded-[2rem] p-6 flex items-center gap-4 group cursor-pointer overflow-hidden relative shadow-lg"
                                onClick={() => router.push(`/shops/${shop._id}`)}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-800 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700 -translate-y-1/2 translate-x-1/2" />

                                <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 overflow-hidden shrink-0 relative z-10">
                                    <img
                                        src={shop.logoImage || `https://via.placeholder.com/100?text=${shop.name[0]}`}
                                        alt={shop.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 relative z-10">
                                    <p className="text-xs font-bold text-secondary-400 uppercase tracking-widest mb-0.5">Sold & Shipped By</p>
                                    <h4 className="text-xl font-bold group-hover:text-secondary-400 transition-colors">{shop.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className="flex">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < Math.floor(shop.rating) ? 'text-secondary-400 fill-secondary-400' : 'text-gray-600'}`} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-bold text-gray-400">{shop.rating.toFixed(1)} Shop Rating</span>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 group-hover:text-white group-hover:bg-secondary-600 transition-all relative z-10">
                                    <ArrowLeft className="w-5 h-5 rotate-180" />
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
