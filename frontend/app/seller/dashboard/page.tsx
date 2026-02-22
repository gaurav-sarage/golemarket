"use client";

import { useEffect, useState } from "react";
import api from "../../../lib/api";
import { useAuthStore } from "../../../store/useAuthStore";
import { Package, ShoppingCart, TrendingUp, DollarSign, Plus, Store } from "lucide-react";
import toast from "react-hot-toast";

export default function SellerDashboard() {
    const { user } = useAuthStore();
    const [shop, setShop] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics');
    const [isLoading, setIsLoading] = useState(true);
    const [needsSetup, setNeedsSetup] = useState(false);

    // Setup shop state
    const [shopForm, setShopForm] = useState({
        name: '', description: '', contactPhone: '', contactEmail: ''
    });
    const [shopLogoFile, setShopLogoFile] = useState<File | null>(null);

    // New product state
    const [isAddingProduct, setIsAddingProduct] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: '', description: '', price: '', sku: '', stockQuantity: '', categoryId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

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
            formData.append('name', newProduct.name);
            formData.append('description', newProduct.description);
            formData.append('price', String(newProduct.price));
            formData.append('sku', newProduct.sku);
            formData.append('stockQuantity', String(newProduct.stockQuantity));
            formData.append('shopId', shop._id);
            formData.append('categoryId', newProduct.categoryId || '600000000000000000000000');

            if (imageFile) {
                formData.append('image', imageFile);
            }

            const { data } = await api.post('/products', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (data.success) {
                toast.success("Product added!");
                setProducts([...products, data.data]);
                setIsAddingProduct(false);
                setNewProduct({ name: '', description: '', price: '', sku: '', stockQuantity: '', categoryId: '' });
                setImageFile(null);

                // Refresh analytics to update stats quickly
                const analyticsRes = await api.get('/analytics/shop');
                if (analyticsRes.data.success) setAnalytics(analyticsRes.data.data);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to add product");
        }
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
            <div className="bg-secondary-600 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold font-heading">{shop?.name || 'Seller Dashboard'}</h1>
                        <p className="text-secondary-100 flex items-center gap-2 mt-1">
                            Welcome back, {user?.name}
                        </p>
                    </div>
                    <div className="flex gap-2 p-1 bg-secondary-700/50 rounded-xl overflow-hidden backdrop-blur-sm">
                        <button
                            onClick={() => setActiveTab('analytics')}
                            className={`px-4 py-2 font-medium rounded-lg transition-all ${activeTab === 'analytics' ? 'bg-white text-secondary-600 shadow-sm' : 'text-secondary-100 hover:text-white hover:bg-white/10'}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 font-medium rounded-lg transition-all ${activeTab === 'products' ? 'bg-white text-secondary-600 shadow-sm' : 'text-secondary-100 hover:text-white hover:bg-white/10'}`}
                        >
                            Products
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
                            className={`px-4 py-2 font-medium rounded-lg transition-all ${activeTab === 'orders' ? 'bg-white text-secondary-600 shadow-sm' : 'text-secondary-100 hover:text-white hover:bg-white/10'}`}
                        >
                            Orders
                        </button>
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
                                onClick={() => setIsAddingProduct(!isAddingProduct)}
                                className="bg-secondary-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-secondary-700 transition-colors font-medium shadow-sm"
                            >
                                <Plus className="w-5 h-5" /> Add New
                            </button>
                        </div>

                        {isAddingProduct && (
                            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-gray-100 mb-8 max-w-4xl mx-auto">
                                <h3 className="text-2xl font-bold mb-8 border-b pb-4 text-gray-900">Create New Product</h3>
                                <form onSubmit={handleCreateProduct} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                        {/* Left Column */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Name</label>
                                                <input required type="text" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white" placeholder="e.g. Premium Wireless Headphones" />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Price (₹)</label>
                                                    <input required type="number" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white" placeholder="0.00" />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Inventory</label>
                                                    <input required type="number" value={newProduct.stockQuantity} onChange={e => setNewProduct({ ...newProduct, stockQuantity: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white" placeholder="0" />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product SKU</label>
                                                <input required type="text" value={newProduct.sku} onChange={e => setNewProduct({ ...newProduct, sku: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white" placeholder="SKU-XXXXXX" />
                                            </div>
                                        </div>

                                        {/* Right Column */}
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image Gallery</label>
                                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-primary-500 transition-colors bg-gray-50" onClick={() => document.getElementById('file-upload')?.click()}>
                                                    <div className="space-y-1 text-center">
                                                        {imageFile ? (
                                                            <p className="text-primary-600 font-medium mb-2">{imageFile.name}</p>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                                <p className="text-sm text-gray-600 mt-2">Click to select an image</p>
                                                            </div>
                                                        )}
                                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={e => {
                                                            if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                                                        }} />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Product Description</label>
                                                <textarea required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full border-gray-300 rounded-xl p-3 border outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all bg-gray-50 focus:bg-white resize-none h-32" placeholder="Write a gorgeous description for what makes this product so special..." />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-4 justify-end mt-10 border-t pt-6">
                                        <button type="button" onClick={() => setIsAddingProduct(false)} className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition-colors">Cancel</button>
                                        <button type="submit" className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-700 shadow-md transition-all hover:-translate-y-0.5">Publish Product</button>
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
                                                    <button onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-semibold">Delete</button>
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
            </div>
        </div>
    );
}
