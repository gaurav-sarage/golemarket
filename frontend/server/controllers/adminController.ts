import { Request, Response } from 'express';
import { User } from '../models/User';
import { Shop } from '../models/Shop';
import { ShopOwner } from '../models/ShopOwner';
import { Product } from '../models/Product';
import { Order, ShopOrder } from '../models/Order';

export const getGlobalCustomerDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalUsers = await User.countDocuments({ role: 'customer' });
        
        // Fetch users dynamically
        const users = await User.find({ role: 'customer' }).select('-password').sort({ createdAt: -1 }).limit(100);
        
        // Let's get total platform orders
        const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
        
        // Sum totalAmount and calculate total items correctly if Order has items.
        // Wait, Order schema from what I just saw does not have `totalItems`. ShopOrder has `items`.
        // If we want totalProductsPurchased globally, we shouldn't rely on Order.totalItems, it doesn't exist.
        // Let's rely on ShopOrder for totalProductsPurchased.
        const shopOrders = await ShopOrder.find();
        let totalProductsPurchased = 0;
        shopOrders.forEach((so: any) => {
            so.items.forEach((item: any) => {
                totalProductsPurchased += item.quantity;
            });
        });
        
        let totalAmountSpent = 0;
        const userStats: Record<string, any> = {};
        
        orders.forEach((order: any) => {
            totalAmountSpent += order.totalAmount;

            const uId = order.userId ? (order.userId as any)._id?.toString() : 'guest';
            if (!userStats[uId]) {
                userStats[uId] = {
                    name: order.userId ? (order.userId as any).name : 'Guest',
                    email: order.userId ? (order.userId as any).email : 'N/A',
                    ordersCount: 0,
                    totalSpent: 0
                };
            }
            userStats[uId].ordersCount += 1;
            userStats[uId].totalSpent += order.totalAmount;
        });

        // Top users by spending
        const topUsers = Object.values(userStats).sort((a: any, b: any) => b.totalSpent - a.totalSpent).slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                totalAmountSpent,
                totalProductsPurchased,
                topUsers,
                recentOrders: orders.slice(0, 20),
                usersList: users
            }
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getGlobalMerchantDashboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const totalShopOwners = await ShopOwner.countDocuments();
        const totalShops = await Shop.countDocuments();
        const totalProducts = await Product.countDocuments();

        const shops = await Shop.find().populate('owner', 'name email phone').sort({ createdAt: -1 }).limit(100);
        
        const shopOrders = await ShopOrder.find().populate('shopId', 'name');

        let totalRevenue = 0;
        let totalSalesCount = 0;

        const shopStats: Record<string, any> = {};

        shopOrders.forEach((order: any) => {
            totalRevenue += order.totalAmount;
            totalSalesCount += 1;

            const sId = order.shopId ? (order.shopId as any)._id?.toString() : 'unknown';
            if (!shopStats[sId]) {
                shopStats[sId] = {
                    name: order.shopId ? (order.shopId as any).name : 'Unknown Shop',
                    salesCount: 0,
                    revenue: 0
                };
            }
            shopStats[sId].salesCount += 1;
            shopStats[sId].revenue += order.totalAmount;
        });

        const topShops = Object.values(shopStats).sort((a: any, b: any) => b.revenue - a.revenue).slice(0, 10);

        res.status(200).json({
            success: true,
            data: {
                totalShopOwners,
                totalShops,
                totalProducts,
                totalRevenue,
                totalSalesCount,
                topShops,
                shopsList: shops
            }
        });

    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};
