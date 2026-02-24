"use client";

import { useEffect, useState, use } from "react";
import api from "../../../lib/api";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail, ShoppingCart, ArrowUpDown, ChevronDown, Clock, AlertCircle } from "lucide-react";
import { isStoreCurrentlyOpen } from "../../../lib/storeUtils";
import Link from "next/link";
import { useCartStore } from "../../../store/useCartStore";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect as useClientEffect } from "react";

export default function ShopDetails({ params }: { params: Promise<{ id: string }> }) {
    const unwrappedParams = use(params);
    const { id } = unwrappedParams;
    const router = useRouter();

    const [shop, setShop] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState<string>("default"); // default, price-asc, price-desc, name-asc, name-desc
    const [foodTypeFilter, setFoodTypeFilter] = useState<string>("All");

    const { addToCart } = useCartStore();

    useEffect(() => {
        fetchShopDetails();
        fetchShopProducts();
    }, [id]);

    useEffect(() => {
        if (shop) {
            const storeStatus = isStoreCurrentlyOpen(shop);
            if (!storeStatus.isOpen) {
                toast.error(`Store is currently closed: ${storeStatus.message}`);
                router.push("/shops");
            }
        }
    }, [shop, router]);

    const fetchShopDetails = async () => {
        try {
            const { data } = await api.get(`/shops/${id}`);
            if (data.success) setShop(data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchShopProducts = async () => {
        try {
            const { data } = await api.get(`/products?shopId=${id}`);
            if (data.success) setProducts(data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddToCart = async (e: React.MouseEvent, product: any) => {
        e.preventDefault();
        e.stopPropagation();
        const success = await addToCart(product._id, 1);
        if (success) {
            toast.success(`${product.name} added to cart!`);
        } else {
            toast.error("Failed to add to cart. Please log in first.");
        }
    };

    const getSortedProducts = () => {
        let filtered = [...products];

        if (foodTypeFilter !== "All") {
            filtered = filtered.filter(p => p.foodType === foodTypeFilter);
        }

        switch (sortBy) {
            case "price-asc": return filtered.sort((a, b) => a.price - b.price);
            case "price-desc": return filtered.sort((a, b) => b.price - a.price);
            case "name-asc": return filtered.sort((a, b) => a.name.localeCompare(b.name));
            case "name-desc": return filtered.sort((a, b) => b.name.localeCompare(a.name));
            default: return filtered;
        }
    };

    const sortedProducts = getSortedProducts();

    if (isLoading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen flex justify-center items-center text-xl text-gray-500">
                Shop not found.
            </div>
        );
    }

    const storeStatus = isStoreCurrentlyOpen(shop);

    return (
        <div className={`min-h-screen bg-gray-50 pb-20 ${!storeStatus.isOpen ? 'grayscale-[0.3]' : ''}`}>
            {!storeStatus.isOpen && (
                <div className="bg-red-600 text-white py-3 px-4 text-center font-bold flex items-center justify-center gap-3 sticky top-16 z-50 animate-pulse shadow-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>Store is Currently Closed. {storeStatus.message}</span>
                </div>
            )}
            {/* Shop Info Banner */}
            <div className="bg-white border-b border-gray-200 shadow-sm relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10 blur-xl">
                    <img src={shop.bannerImage || "https://images.unsplash.com/photo-1542838132-92c53300491e"} className="w-full h-full object-cover" alt="" />
                </div>

                <div className="max-w-7xl mx-auto px-4 py-12 relative z-10 flex flex-col md:flex-row gap-8 items-start md:items-center">
                    <div className="w-32 h-32 rounded-3xl overflow-hidden shadow-lg border-4 border-white shrink-0 bg-primary-50 flex items-center justify-center">
                        <img
                            src={shop.logoImage || `https://via.placeholder.com/300?text=${shop.name[0]}`}
                            alt={shop.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <h1 className="text-4xl font-heading font-extrabold text-gray-900 mb-2">{shop.name}</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mb-4">{shop.description}</p>

                        <div className="flex flex-wrap gap-4 text-sm font-medium">
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-700">
                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" /> {shop.rating.toFixed(1)} Rating
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 text-blue-700">
                                <MapPin className="w-4 h-4" /> {shop.section?.name || 'Section'}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                                <Phone className="w-4 h-4" /> {shop.contactPhone}
                            </span>
                            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                                <Mail className="w-4 h-4" /> {shop.contactEmail}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 mt-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-gray-900">Categories</h3>
                        <ul className="space-y-2 mb-8">
                            <li className="font-medium text-primary-600 bg-primary-50 px-3 py-2 rounded-lg cursor-pointer transition-colors">All Products</li>
                        </ul>

                        {(shop.shopType === 'restaurant' || shop.shopType === 'grocery' || shop.shopType === 'cafes') && (
                            <>
                                <h3 className="font-bold text-lg mb-4 text-gray-900 border-t pt-6">Food Type</h3>
                                <div className="space-y-2">
                                    {["All", "Veg", "Non-Veg", "Egg"].map(type => (
                                        <label key={type} className="flex items-center gap-3 cursor-pointer group">
                                            <input
                                                type="radio"
                                                name="foodType"
                                                checked={foodTypeFilter === type}
                                                onChange={() => setFoodTypeFilter(type)}
                                                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                                            />
                                            <span className={`text-sm font-medium ${foodTypeFilter === type ? 'text-primary-600' : 'text-gray-600 group-hover:text-gray-900'}`}>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="md:col-span-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                        <h2 className="text-2xl font-bold font-heading flex items-center gap-2">
                            Available Products <span className="text-gray-400 font-normal text-lg">({products.length})</span>
                        </h2>

                        <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-primary-500 transition-all">
                            <ArrowUpDown className="w-4 h-4 text-gray-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent text-sm font-bold text-gray-700 outline-none cursor-pointer pr-8 appearance-none relative z-10"
                            >
                                <option value="default">Sort By: Featured</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                                <option value="name-desc">Name: Z to A</option>
                            </select>
                        </div>
                    </div>

                    {products.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                            <p className="text-gray-500 text-lg">This shop hasn't added any products yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                            {sortedProducts.map((product: any, i) => (
                                <Link
                                    href={`/products/${product._id}`}
                                    key={product._id}
                                    className="block h-full"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all group flex flex-col h-full"
                                    >
                                        <div className="h-48 bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                                            <img
                                                src={product.images?.[0] || "https://via.placeholder.com/300?text=No+Image"}
                                                alt={product.name}
                                                className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500"
                                            />
                                            {product.stockQuantity < 5 && product.stockQuantity > 0 && (
                                                <div className="absolute top-3 left-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                                                    Only {product.stockQuantity} left!
                                                </div>
                                            )}
                                            {product.stockQuantity === 0 && (
                                                <div className="absolute top-3 left-3 bg-gray-800 text-white px-2 py-1 rounded-full text-xs font-bold">
                                                    Out of Stock
                                                </div>
                                            )}
                                            {product.foodType && product.foodType !== 'Not Applicable' && (
                                                <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1 ${product.foodType === 'Veg' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                    product.foodType === 'Non-Veg' ? 'bg-red-100 text-red-700 border border-red-200' :
                                                        'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                                    }`}>
                                                    <div className={`w-2 h-2 rounded-full ${product.foodType === 'Veg' ? 'bg-green-500' :
                                                        product.foodType === 'Non-Veg' ? 'bg-red-500' :
                                                            'bg-yellow-500'
                                                        }`} />
                                                    {product.foodType}
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-5 flex flex-col flex-1 border-t border-gray-50">
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start gap-4 mb-2">
                                                    <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
                                                        {product.name}
                                                    </h4>
                                                    <span className="font-extrabold text-lg text-primary-600 shrink-0">₹{product.price}</span>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                                                    {product.description}
                                                </p>
                                            </div>

                                            <button
                                                onClick={(e) => handleAddToCart(e, product)}
                                                disabled={product.stockQuantity === 0 || !storeStatus.isOpen}
                                                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm ${product.stockQuantity === 0 || !storeStatus.isOpen
                                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-md'
                                                    }`}
                                            >
                                                <ShoppingCart className="w-5 h-5" />
                                                {product.stockQuantity === 0 ? "Out of Stock" : !storeStatus.isOpen ? "Store Closed" : "Add to Cart"}
                                            </button>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
