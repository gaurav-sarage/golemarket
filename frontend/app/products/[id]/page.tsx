"use client";

import { useEffect, useState, use } from "react";
import api from "../../../lib/api";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail, ShoppingCart, ArrowLeft, ShieldCheck, Truck, Clock, Tag, ChevronLeft, ChevronRight, Flame, Sparkles, ThumbsUp, Award } from "lucide-react";
import { useCartStore } from "../../../store/useCartStore";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const router = useRouter();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const [product, setProduct] = useState<any>(null);
    const [shop, setShop] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const { addToCart } = useCartStore();
    const [quantity, setQuantity] = useState(1);

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
            } else {
                setErrorMsg(data.message || "Product not found.");
            }
        } catch (err: any) {
            setErrorMsg(err.response?.data?.message || err.message || "Failed to fetch product.");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchShopDetails = async (shopId: any) => {
        try {
            const idVal = typeof shopId === 'object' ? (shopId as any)._id : shopId;
            const { data } = await api.get(`/shops/${idVal}`);
            if (data.success) setShop(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleAddToCart = async (force: boolean = false) => {
        const result = await addToCart(product._id, quantity, force);
        if (result.success) {
            toast.success(`${product.name} (${quantity}) added to cart!`);
        } else if (result.code === 'DIFFERENT_SHOP') {
            if (window.confirm(result.message)) {
                handleAddToCart(true);
            }
        } else {
            toast.error(result.message || "Failed to add to cart. Please log in first.");
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (errorMsg || !product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <p className="text-xl text-gray-500 font-medium">{errorMsg || "Product not found."}</p>
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
                        className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm p-8 flex flex-col items-center justify-center min-h-[400px] lg:min-h-[600px] relative group"
                    >
                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.img
                                key={currentImageIndex}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                                src={product.images?.[currentImageIndex] || "https://via.placeholder.com/600?text=No+Image"}
                                alt={product.name}
                                className="max-w-full max-h-[500px] object-contain"
                            />

                            {product.images?.length > 1 && (
                                <>
                                    <button
                                        onClick={() => setCurrentImageIndex((currentImageIndex - 1 + product.images.length) % product.images.length)}
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <button
                                        onClick={() => setCurrentImageIndex((currentImageIndex + 1) % product.images.length)}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-lg flex items-center justify-center text-gray-800 hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </button>

                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2">
                                        {product.images.map((_: any, idx: number) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCurrentImageIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-primary-600 w-6' : 'bg-gray-200'}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {product.stockQuantity < 5 && product.stockQuantity > 0 && (
                            <div className="absolute top-8 left-8 bg-red-100 text-red-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm z-20">
                                Low Stock: {product.stockQuantity} Left
                            </div>
                        )}
                        {product.stockQuantity === 0 && (
                            <div className="absolute top-8 left-8 bg-gray-900 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm z-20">
                                Sold Out
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
                                <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-full text-xs font-bold uppercase tracking-wider border border-primary-100/50">
                                    {product.categoryName || 'General'}
                                </span>
                                {product.foodType && product.foodType !== 'Not Applicable' && (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.15em] border ${product.foodType === 'Veg' ? 'bg-green-50 text-green-600 border-green-100' :
                                        product.foodType === 'Non-Veg' ? 'bg-red-50 text-red-600 border-red-100' :
                                            'bg-yellow-50 text-yellow-600 border-yellow-100'
                                        }`}>
                                        {product.foodType}
                                    </span>
                                )}
                                {product.isMustTry && (
                                    <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-orange-200 flex items-center gap-1 shadow-sm">
                                        <ThumbsUp className="w-3 h-3" /> Must Try
                                    </span>
                                )}
                                {product.isChefSpecial && (
                                    <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-purple-200 flex items-center gap-1 shadow-sm">
                                        <Sparkles className="w-3 h-3" /> Chef's Special
                                    </span>
                                )}
                                {product.isBestseller && (
                                    <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border border-blue-200 flex items-center gap-1 shadow-sm">
                                        <Award className="w-3 h-3" /> Bestseller
                                    </span>
                                )}
                                {product.spiceLevel && product.spiceLevel !== 'None' && (
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border flex items-center gap-1 shadow-sm ${['Hot', 'Extra Hot'].includes(product.spiceLevel) ? 'bg-red-50 text-red-600 border-red-100' : 'bg-orange-50 text-orange-600 border-orange-100'
                                        }`}>
                                        <Flame className={`w-3 h-3 ${product.spiceLevel === 'Extra Hot' ? 'animate-pulse' : ''}`} />
                                        {product.spiceLevel} Spice
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
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Prep Time</p>
                                            <p className="text-sm font-bold text-gray-900">{product.preparationTime} mins</p>
                                        </div>
                                    </div>
                                )}
                                {product.portionSize && (['restaurant', 'cafes'].includes(shop?.shopType)) && (
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                                            <Tag className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Portion</p>
                                            <p className="text-sm font-bold text-gray-900">{product.portionSize}</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mb-8">
                                <div className="flex items-center bg-gray-100 rounded-2xl p-1.5 border border-gray-200 transition-all focus-within:border-primary-500">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-black text-xl"
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-12 text-center bg-transparent font-black text-gray-900 outline-none"
                                    />
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-white rounded-xl transition-all font-black text-xl"
                                    >
                                        +
                                    </button>
                                </div>
                                <button
                                    onClick={() => handleAddToCart()}
                                    disabled={product.stockQuantity === 0}
                                    className={`flex-1 py-4.5 rounded-[1.2rem] font-black text-base flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${product.stockQuantity === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                                        : 'bg-primary-600 text-white hover:bg-primary-700 hover:-translate-y-1 shadow-primary-500/20'
                                        }`}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    {product.stockQuantity === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                                </button>
                            </div>
                        </div>

                    </motion.div>
                </div>
            </div>
        </div>
    );
}
