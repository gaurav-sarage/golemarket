"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/useAuthStore";
import { Package, ShoppingCart, TrendingUp, DollarSign, Plus, Store, Check, X, Clock, Calendar, Tag, Info, CheckCircle, AlertCircle, Edit, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import StoreSettings from "../../../components/dashboard/StoreSettings";
import ProfileSettings from "../../../components/dashboard/ProfileSettings";
import OnboardingWelcome from "../../../components/onboarding/OnboardingWelcome";

export default function SellerDashboard() {
    const { user } = useAuthStore();
    const [shop, setShop] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders' | 'settings' | 'profile'>('analytics');
    const [isLoading, setIsLoading] = useState(false);
    const [needsSetup, setNeedsSetup] = useState(false);
    const [showOnboarding, setShowOnboarding] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('onboarding_seller_completed');
        if (!hasVisited && !needsSetup) {
            setShowOnboarding(true);
        }
    }, [needsSetup]);

    const { isAuthenticated, isLoading: isAuthLoading, checkAuth } = useAuthStore();
    const router = useRouter();

    // Setup shop state
    const [shopForm, setShopForm] = useState({
        name: '', description: '', contactPhone: '', contactEmail: '', category: 'restaurants'
    });
    const [shopLogoFile, setShopLogoFile] = useState<File | null>(null);

    // New product / Edit product state
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [isEditingProduct, setIsEditingProduct] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const INITIAL_PRODUCT_STATE = {
        name: '', description: '', price: '', salePrice: '', sku: '', stockQuantity: '', categoryId: '',
        foodCategory: 'Veg', foodType: 'Veg', preparationTime: '', portionSize: '', stockLimitPerDay: '',
        categoryName: '', subCategoryName: '', unitType: 'Piece', minimumOrderQuantity: '', expiryDate: '',
        serviceDuration: '', vehicleCompatibility: '', availableDays: '',
        deliveryEligibility: true, pickupAvailability: true, trackInventory: true,
        appointmentRequired: false, taxIndicator: false,
        productStatus: 'Published', availabilityStatus: 'Available'
    };
    const [newProduct, setNewProduct] = useState<any>(INITIAL_PRODUCT_STATE);

    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/seller/login');
        } else if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthLoading, isAuthenticated, router]);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            // 1. Get Shop
            try {
                const shopRes = await api.get('/shops/my-shop');
                if (!shopRes.data.success || !shopRes.data.data) {
                    setNeedsSetup(true);
                    setIsLoading(false);
                    return;
                }
                const myShop = shopRes.data.data;
                setShop(myShop);
                setNeedsSetup(false);

                // 2. Get Analytics
                const analyticsRes = await api.get('/analytics/shop');
                if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);

                // 3. Get Products
                const productsRes = await api.get(`/products?shopId=${myShop._id}&limit=50`);
                if (productsRes.data.success) setProducts(productsRes.data.data);

                // 4. Get Orders
                const ordersRes = await api.get(`/orders/shop/${myShop._id}`);
                if (ordersRes.data.success) setOrders(ordersRes.data.data);
            } catch (err: any) {
                if (err.response?.status === 404) {
                    setNeedsSetup(true);
                } else {
                    toast.error("Error loading dashboard data");
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateShop = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', shopForm.name);
            formData.append('description', shopForm.description);
            formData.append('contactPhone', shopForm.contactPhone);
            formData.append('contactEmail', shopForm.contactEmail);
            formData.append('category', shopForm.category);

            const slug = shopForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            formData.append('slug', slug);

            if (shopLogoFile) {
                formData.append('logo', shopLogoFile);
            }

            const { data } = await api.post('/shops', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success("Shop registered successfully!");
                fetchData();
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to create shop");
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.keys(newProduct).forEach(key => {
                if (newProduct[key] !== '' && newProduct[key] !== undefined && newProduct[key] !== null) {
                    formData.append(key, String(newProduct[key]));
                }
            });
            formData.append('shopId', shop._id);
            if (!newProduct.categoryId) {
                formData.append('categoryId', '600000000000000000000000');
            }

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const endpoint = isEditingProduct ? `/products/${editingProductId}` : '/products';
            const method = isEditingProduct ? 'put' : 'post';

            const { data } = await api[method](endpoint, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success(isEditingProduct ? "Product updated!" : "Product added!");
                if (isEditingProduct) {
                    setProducts(products.map(p => p._id === editingProductId ? data.data : p));
                } else {
                    setProducts([...products, data.data]);
                }
                setIsAddingProduct(false);
                setIsEditingProduct(false);
                setEditingProductId(null);
                setNewProduct(INITIAL_PRODUCT_STATE);
                setImageFile(null);

                // Refresh analytics to update stats quickly
                const analyticsRes = await api.get('/analytics/shop');
                if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || `Failed to ${isEditingProduct ? 'update' : 'add'} product`);
        }
    };

    const handleEditClick = (product: any) => {
        setNewProduct({
            name: product.name || '',
            description: product.description || '',
            price: product.price || '',
            salePrice: product.salePrice || '',
            sku: product.sku || '',
            stockQuantity: product.stockQuantity || '',
            categoryId: product.categoryId || '',
            foodCategory: product.foodCategory || 'Veg',
            foodType: product.foodType || 'Veg',
            preparationTime: product.preparationTime || '',
            portionSize: product.portionSize || '',
            stockLimitPerDay: product.stockLimitPerDay || '',
            categoryName: product.categoryName || '',
            subCategoryName: product.subCategoryName || '',
            unitType: product.unitType || 'Piece',
            minimumOrderQuantity: product.minimumOrderQuantity || '',
            expiryDate: product.expiryDate ? new Date(product.expiryDate).toISOString().split('T')[0] : '',
            serviceDuration: product.serviceDuration || '',
            vehicleCompatibility: product.vehicleCompatibility || '',
            availableDays: product.availableDays || '',
            deliveryEligibility: product.deliveryEligibility ?? true,
            pickupAvailability: product.pickupAvailability ?? true,
            trackInventory: product.trackInventory ?? true,
            appointmentRequired: product.appointmentRequired ?? false,
            taxIndicator: product.taxIndicator ?? false,
            productStatus: product.productStatus || 'Published',
            availabilityStatus: product.availabilityStatus || 'Available'
        });
        setEditingProductId(product._id);
        setIsEditingProduct(true);
        setIsAddingProduct(true); // Share the same form visibility
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDeleteProduct = async (id: string) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        try {
            const { data } = await api.delete(`/products/${id}`);
            if (data.success) {
                toast.success("Product deleted");
                setProducts(products.filter(p => p._id !== id));
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to delete product");
        }
    };

    if (isLoading) return <div className="min-h-screen flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;

    if (needsSetup) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl border border-gray-100 p-8 sm:p-10">
                    <div className="mx-auto flex justify-center w-fit p-4 bg-primary-100 rounded-full text-primary-600 mb-6">
                        <Store className="w-12 h-12" />
                    </div>
                    <h2 className="text-3xl font-heading font-extrabold text-gray-900 text-center mb-2">Welcome to Gole Market!</h2>
                    <p className="text-gray-500 text-center mb-8">It looks like you haven't created your shop profile yet. Let's start by setting up your storefront.</p>

                    <form onSubmit={handleCreateShop} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Name</label>
                            <input required type="text" value={shopForm.name} onChange={e => setShopForm({ ...shopForm, name: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white" placeholder="My Awesome Store" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select value={shopForm.category} onChange={e => setShopForm({ ...shopForm, category: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white">
                                <option value="restaurants">Restaurants</option>
                                <option value="grocery">Grocery</option>
                                <option value="cafes">Cafes</option>
                                <option value="salons">Salons</option>
                                <option value="auto">Auto</option>
                                <option value="general stores">General Stores</option>
                                <option value="others">Others</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                            <input required type="email" value={shopForm.contactEmail} onChange={e => setShopForm({ ...shopForm, contactEmail: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white" placeholder="store@example.com" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                            <input required type="tel" value={shopForm.contactPhone} onChange={e => setShopForm({ ...shopForm, contactPhone: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white" placeholder="+91 98765 43210" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Brand Logo (Optional)</label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-primary-500 transition-colors bg-gray-50 mb-4" onClick={() => document.getElementById('shop-logo-upload')?.click()}>
                                <div className="space-y-1 text-center">
                                    {shopLogoFile ? (
                                        <p className="text-primary-600 font-medium mb-2">{shopLogoFile.name}</p>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <p className="text-sm text-gray-600">Click to select a logo</p>
                                        </div>
                                    )}
                                    <input id="shop-logo-upload" type="file" className="sr-only" accept="image/*" onChange={e => {
                                        if (e.target.files && e.target.files[0]) setShopLogoFile(e.target.files[0]);
                                    }} />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Shop Description</label>
                            <textarea required value={shopForm.description} onChange={e => setShopForm({ ...shopForm, description: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white resize-none h-24" placeholder="What does your store sell?" />
                        </div>

                        <button type="submit" className="w-full bg-primary-600 text-white px-6 py-3.5 rounded-xl font-bold hover:bg-primary-700 shadow-md transition-all mt-4">Create My Shop Now</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Small Sidebar / Topbar for navigation */}
            <div className="bg-secondary-600 text-white shadow-xl">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20 shadow-inner">
                                <Store className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-black font-heading tracking-tight leading-none mb-1">{shop?.name || 'Seller Dashboard'}</h1>
                                <p className="text-secondary-100 text-sm font-bold opacity-80 uppercase tracking-widest">
                                    Welcome back, {user?.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
                            <div className="flex items-center justify-between gap-4 px-5 py-3 bg-black/20 rounded-2xl border border-white/10 backdrop-blur-sm">
                                <span className={`text-xs font-black uppercase tracking-widest ${shop?.status === 'open' ? 'text-green-400' : 'text-red-400'}`}>
                                    {shop?.status === 'open' ? 'Live Now' : 'Store Offline'}
                                </span>
                                <button
                                    onClick={async () => {
                                        const newStatus = shop?.status === 'open' ? 'closed' : 'open';
                                        try {
                                            const res = await api.put(`/shops/${shop._id}`, { status: newStatus });
                                            if (res.data.success) {
                                                setShop({ ...shop, status: newStatus });
                                                toast.success(`Store is now ${newStatus}`);
                                            }
                                        } catch (err) {
                                            toast.error("Failed to update status");
                                        }
                                    }}
                                    className={`w-12 h-6 rounded-full transition-all relative ${shop?.status === 'open' ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-gray-500'}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm ${shop?.status === 'open' ? 'right-1' : 'left-1'}`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-4 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
                        {([
                            { id: 'analytics', label: 'Overview' },
                            { id: 'products', label: 'Products' },
                            { id: 'orders', label: 'Orders' },
                            { id: 'settings', label: 'Settings' },
                            { id: 'profile', label: 'Profile' }
                        ] as const).map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all border ${activeTab === tab.id
                                    ? 'bg-white text-secondary-600 border-white shadow-lg scale-105'
                                    : 'bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white'}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
                {activeTab === 'analytics' && analytics && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                                <div className="p-4 bg-green-50 rounded-xl text-green-600">
                                    <DollarSign className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                                    <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRevenue}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                                <div className="p-4 bg-blue-50 rounded-xl text-blue-600">
                                    <ShoppingCart className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                    <p className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                                <div className="p-4 bg-purple-50 rounded-xl text-purple-600">
                                    <Package className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Active Products</p>
                                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow cursor-default">
                                <div className="p-4 bg-orange-50 rounded-xl text-orange-600">
                                    <TrendingUp className="w-8 h-8" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-1">Avg Order Value</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        ₹{analytics.totalOrders > 0 ? Math.round(analytics.totalRevenue / analytics.totalOrders) : 0}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mt-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">Best Selling Products</h3>
                            {analytics.bestSellingProducts.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr>
                                                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tl-xl">Product Name</th>
                                                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-bold text-gray-500 uppercase tracking-wider rounded-tr-xl">Units Sold</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {analytics.bestSellingProducts.map((p: any) => (
                                                <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{p.name}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right font-bold">{p.count}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="text-gray-500 text-center py-10 bg-gray-50 rounded-xl">No sales data available yet.</p>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Manage Inventory</h2>
                            <button
                                onClick={() => {
                                    if (isAddingProduct) {
                                        setIsAddingProduct(false);
                                        setIsEditingProduct(false);
                                        setEditingProductId(null);
                                        setNewProduct(INITIAL_PRODUCT_STATE);
                                    } else {
                                        setIsAddingProduct(true);
                                    }
                                }}
                                className="bg-secondary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary-700 transition-colors font-medium shadow-sm"
                            >
                                {isAddingProduct ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                                {isAddingProduct ? 'Cancel' : 'Add New'}
                            </button>
                        </div>

                        {isAddingProduct && (
                            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 mb-8 max-w-6xl mx-auto">
                                <div className="flex justify-between items-center mb-8 border-b pb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{isEditingProduct ? 'Update' : 'Add New'} {shop?.shopType === 'salons' ? 'Service' : 'Product'}</h3>
                                    <div className="flex items-center gap-2 px-3 py-1 bg-primary-50 text-primary-700 rounded-lg text-sm font-bold capitalize">
                                        <Tag className="w-4 h-4" /> {shop?.shopType || 'General'}
                                    </div>
                                </div>
                                <form onSubmit={handleCreateProduct} className="space-y-8">
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

                                        {/* Column 1: Core Info */}
                                        <div className="lg:col-span-2 space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Item Name</label>
                                                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder={`e.g. ${shop?.shopType === 'restaurant' ? 'Butter Chicken' : 'Premium Product'}`} />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Price (₹)</label>
                                                    <input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="0.00" />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">Sale Price (Optional)</label>
                                                    <input type="number" value={newProduct.salePrice} onChange={e => setNewProduct({ ...newProduct, salePrice: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="0.00" />
                                                </div>

                                                {/* SKU Logic */}
                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 mb-2">SKU</label>
                                                    <div className="relative">
                                                        <input required type="text" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="AUTO-GEN" />
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct({ ...newProduct, sku: `SKU-${Math.random().toString(36).substring(2, 8).toUpperCase()}` })}
                                                            className="absolute right-2 top-2 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-300 transition-colors"
                                                        >
                                                            Generate
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Dynamic Category/Type based on Shop Type */}
                                                {['restaurant', 'grocery', 'cafes', 'general stores'].includes(shop?.shopType) && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Food Type (Veg/Non-Veg)</label>
                                                        <select value={newProduct.foodType} onChange={e => setNewProduct({ ...newProduct, foodType: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white">
                                                            <option value="Veg">Veg</option>
                                                            <option value="Non-Veg">Non-Veg</option>
                                                            <option value="Egg">Egg</option>
                                                            <option value="Not Applicable">Not Applicable</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {shop?.shopType === 'restaurant' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Food Category</label>
                                                        <select value={newProduct.foodCategory} onChange={e => setNewProduct({ ...newProduct, foodCategory: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white">
                                                            <option value="Veg">Veg</option>
                                                            <option value="Non-Veg">Non-Veg</option>
                                                            <option value="Beverage">Beverage</option>
                                                            <option value="Combo">Combo</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {(shop?.shopType === 'grocery' || shop?.shopType === 'general stores') && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Unit Type</label>
                                                        <select value={newProduct.unitType} onChange={e => setNewProduct({ ...newProduct, unitType: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white">
                                                            <option value="Kg">Kg</option>
                                                            <option value="Gram">Gram</option>
                                                            <option value="Litre">Litre</option>
                                                            <option value="Piece">Piece</option>
                                                            <option value="Pack">Pack</option>
                                                            <option value="Box">Box</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {shop?.shopType === 'salons' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Service Category</label>
                                                        <input type="text" value={newProduct.categoryName} onChange={e => setNewProduct({ ...newProduct, categoryName: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="Hair / Skin / Grooming" />
                                                    </div>
                                                )}

                                                {shop?.shopType === 'salons' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Duration (Min)</label>
                                                        <input type="number" value={newProduct.serviceDuration} onChange={e => setNewProduct({ ...newProduct, serviceDuration: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="30" />
                                                    </div>
                                                )}

                                                {shop?.shopType === 'salons' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Available Days</label>
                                                        <input type="text" value={newProduct.availableDays} onChange={e => setNewProduct({ ...newProduct, availableDays: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="e.g. Mon, Tue, Fri" />
                                                    </div>
                                                )}

                                                {shop?.shopType === 'restaurant' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Prep Time (Min)</label>
                                                        <input type="number" value={newProduct.preparationTime} onChange={e => setNewProduct({ ...newProduct, preparationTime: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="15" />
                                                    </div>
                                                )}

                                                {shop?.shopType === 'restaurant' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Portion / Size</label>
                                                        <input type="text" value={newProduct.portionSize} onChange={e => setNewProduct({ ...newProduct, portionSize: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="e.g. Full, Half, Regular" />
                                                    </div>
                                                )}

                                                {shop?.shopType === 'restaurant' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Daily Stock Limit (Opt)</label>
                                                        <input type="number" value={newProduct.stockLimitPerDay} onChange={e => setNewProduct({ ...newProduct, stockLimitPerDay: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="e.g. 50" />
                                                    </div>
                                                )}

                                                {shop?.shopType === 'auto' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Item Type</label>
                                                        <select value={newProduct.foodCategory} onChange={e => setNewProduct({ ...newProduct, foodCategory: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white">
                                                            <option value="Parts">Parts</option>
                                                            <option value="Service">Service</option>
                                                        </select>
                                                    </div>
                                                )}

                                                {shop?.shopType === 'grocery' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Weight Variant</label>
                                                        <input type="text" value={newProduct.portionSize} onChange={e => setNewProduct({ ...newProduct, portionSize: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="e.g. 500g, 1kg, 5kg" />
                                                    </div>
                                                )}

                                                {(shop?.shopType === 'grocery' || shop?.shopType === 'general stores') && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Min. Order Qty</label>
                                                        <input type="number" value={newProduct.minimumOrderQuantity} onChange={e => setNewProduct({ ...newProduct, minimumOrderQuantity: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="1" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Advanced Category / Subcategory */}
                                            {shop?.shopType !== 'restaurant' && shop?.shopType !== 'salons' && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                                                        <input type="text" value={newProduct.categoryName} onChange={e => setNewProduct({ ...newProduct, categoryName: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="Electronics / Clothing" />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Subcategory</label>
                                                        <input type="text" value={newProduct.subCategoryName} onChange={e => setNewProduct({ ...newProduct, subCategoryName: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="Sub-category" />
                                                    </div>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Description</label>
                                                <textarea required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white resize-none h-40" placeholder="Describe your product/service features, benefits..." />
                                            </div>

                                            {/* Type Specific Extras */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {shop?.shopType === 'grocery' && (
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Expiry Date</label>
                                                        <input type="date" value={newProduct.expiryDate} onChange={e => setNewProduct({ ...newProduct, expiryDate: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" />
                                                    </div>
                                                )}
                                                {shop?.shopType === 'auto' && (
                                                    <div className="md:col-span-2">
                                                        <label className="block text-sm font-bold text-gray-700 mb-2">Vehicle Compatibility</label>
                                                        <input type="text" value={newProduct.vehicleCompatibility} onChange={e => setNewProduct({ ...newProduct, vehicleCompatibility: e.target.value })} className="w-full border-gray-200 rounded-xl p-3.5 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-gray-50/50 focus:bg-white" placeholder="e.g. BMW X5 2018-2022, Toyota Camry..." />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Column 2: Status, Image & Inventory */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Product Image</label>
                                                <div className="mt-1 flex flex-col items-center justify-center p-6 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer hover:border-primary-500 transition-all bg-gray-50/50 group" onClick={() => document.getElementById('product-file-upload')?.click()}>
                                                    {imageFile ? (
                                                        <div className="text-center">
                                                            <CheckCircle className="w-10 h-10 text-green-500 mx-auto mb-2" />
                                                            <p className="text-primary-600 font-bold text-sm truncate max-w-[150px]">{imageFile.name}</p>
                                                            <p className="text-gray-400 text-xs mt-1">Tap to change</p>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <Plus className="w-10 h-10 text-gray-300 group-hover:text-primary-400 mx-auto mb-2" />
                                                            <p className="text-sm font-bold text-gray-500 group-hover:text-primary-600">Upload Media</p>
                                                            <p className="text-xs text-gray-400 mt-1">JPG, PNG up to 5MB</p>
                                                        </div>
                                                    )}
                                                    <input id="product-file-upload" type="file" className="sr-only" accept="image/*" onChange={e => {
                                                        if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                                                    }} />
                                                </div>
                                            </div>

                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-6">
                                                <h4 className="text-sm font-bold text-gray-900 border-b pb-3 mb-2 flex items-center gap-2">
                                                    <Info className="w-4 h-4 text-primary-500" /> Inventory & Status
                                                </h4>

                                                {shop?.shopType !== 'salons' && (
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Stock Quantity</label>
                                                        <input type="number" value={newProduct.stockQuantity} onChange={e => setNewProduct({ ...newProduct, stockQuantity: e.target.value })} className="w-full border-gray-200 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 transition-all bg-white" placeholder="0" />
                                                    </div>
                                                )}

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-gray-700">{shop?.shopType === 'salons' ? 'Active' : 'Available'}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct({ ...newProduct, availabilityStatus: newProduct.availabilityStatus === 'Available' ? 'Out of Stock' : 'Available' })}
                                                            className={`w-12 h-6 rounded-full transition-all relative ${newProduct.availabilityStatus === 'Available' ? 'bg-green-500' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProduct.availabilityStatus === 'Available' ? 'right-1' : 'left-1'}`} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-gray-700">Pickup</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct({ ...newProduct, pickupAvailability: !newProduct.pickupAvailability })}
                                                            className={`w-12 h-6 rounded-full transition-all relative ${newProduct.pickupAvailability ? 'bg-teal-500' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProduct.pickupAvailability ? 'right-1' : 'left-1'}`} />
                                                        </button>
                                                    </div>

                                                    {shop?.shopType !== 'salons' && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-gray-700">Track Stock</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setNewProduct({ ...newProduct, trackInventory: !newProduct.trackInventory })}
                                                                className={`w-12 h-6 rounded-full transition-all relative ${newProduct.trackInventory ? 'bg-blue-600' : 'bg-gray-300'}`}
                                                            >
                                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProduct.trackInventory ? 'right-1' : 'left-1'}`} />
                                                            </button>
                                                        </div>
                                                    )}

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-gray-700">Published</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct({ ...newProduct, productStatus: newProduct.productStatus === 'Published' ? 'Draft' : 'Published' })}
                                                            className={`w-12 h-6 rounded-full transition-all relative ${newProduct.productStatus === 'Published' ? 'bg-primary-600' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProduct.productStatus === 'Published' ? 'right-1' : 'left-1'}`} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-gray-700">Delivery</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct({ ...newProduct, deliveryEligibility: !newProduct.deliveryEligibility })}
                                                            className={`w-12 h-6 rounded-full transition-all relative ${newProduct.deliveryEligibility ? 'bg-secondary-500' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProduct.deliveryEligibility ? 'right-1' : 'left-1'}`} />
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-bold text-gray-700">Tax Included</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => setNewProduct({ ...newProduct, taxIndicator: !newProduct.taxIndicator })}
                                                            className={`w-12 h-6 rounded-full transition-all relative ${newProduct.taxIndicator ? 'bg-indigo-500' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProduct.taxIndicator ? 'right-1' : 'left-1'}`} />
                                                        </button>
                                                    </div>

                                                    {(shop?.shopType === 'salons' || shop?.shopType === 'auto') && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-sm font-bold text-gray-700">Appointment Req.</span>
                                                            <button
                                                                type="button"
                                                                onClick={() => setNewProduct({ ...newProduct, appointmentRequired: !newProduct.appointmentRequired })}
                                                                className={`w-12 h-6 rounded-full transition-all relative ${newProduct.appointmentRequired ? 'bg-amber-500' : 'bg-gray-300'}`}
                                                            >
                                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${newProduct.appointmentRequired ? 'right-1' : 'left-1'}`} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 justify-end mt-10 border-t pt-8">
                                        <button type="button" onClick={() => {
                                            setIsAddingProduct(false);
                                            setIsEditingProduct(false);
                                            setEditingProductId(null);
                                            setNewProduct(INITIAL_PRODUCT_STATE);
                                        }} className="px-8 py-3.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-all">Discard</button>
                                        <button type="submit" className="bg-primary-600 text-white px-10 py-3.5 rounded-xl font-bold hover:bg-primary-700 shadow-xl shadow-primary-500/20 transition-all hover:-translate-y-1 active:scale-95">
                                            {isEditingProduct ? 'Update Changes' : 'Complete & Publish'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Product</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">SKU</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Stock</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {products.map(product => (
                                            <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-l-4 border-transparent hover:border-secondary-500">
                                                    {product.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sku}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{product.price}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stockQuantity > 10 ? 'bg-green-100 text-green-800' : product.stockQuantity > 0 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                                        {product.stockQuantity} in stock
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleEditClick(product)} className="text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1.5">
                                                            <Edit className="w-4 h-4" /> Edit
                                                        </button>
                                                        <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-semibold flex items-center gap-1.5">
                                                            <Trash2 className="w-4 h-4" /> Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {products.length === 0 && (
                                <div className="p-10 text-center text-gray-500 bg-gray-50">No products found. Start by adding some!</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && (
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Orders</h2>
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Order ID</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Amount</th>
                                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {orders.map(order => (
                                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{order._id.substring(0, 10)}...</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.userId?.name || 'Unknown'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">₹{order.totalAmount}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${order.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {order.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {orders.length === 0 && (
                                <div className="p-10 text-center text-gray-500 bg-gray-50">No orders received yet.</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <StoreSettings shop={shop} onUpdate={setShop} />
                )}

                {activeTab === 'profile' && (
                    <ProfileSettings user={user} onUpdate={checkAuth} />
                )}
            </div>

            {showOnboarding && (
                <OnboardingWelcome
                    type="seller"
                    name={user?.name || 'Partner'}
                    onComplete={() => {
                        setShowOnboarding(false);
                        localStorage.setItem('onboarding_seller_completed', 'true');
                    }}
                />
            )}
        </div>
    );
}
