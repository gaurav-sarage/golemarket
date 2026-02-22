import { Request, Response } from 'express';
import { ShopOrder } from '../models/Order';
import { Product } from '../models/Product';
import { Shop } from '../models/Shop';

export const getShopAnalytics = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop = await Shop.findOne({ owner: (req as any).user.id });
        if (!shop) { res.status(404).json({ success: false, message: 'Shop not found' }); return; }

        const shopId = shop._id;

        const orders = await ShopOrder.find({ shopId });

        let totalRevenue = 0;
        let totalOrders = orders.length;

        const monthlySales: Record<string, number> = {};
        const productSalesCount: Record<string, { count: number; name: string }> = {};

        orders.forEach(order => {
            if (order.status !== 'Cancelled') {
                totalRevenue += order.totalAmount;

                const month = order.createdAt.toLocaleString('default', { month: 'short', year: 'numeric' });
                monthlySales[month] = (monthlySales[month] || 0) + order.totalAmount;

                order.items.forEach((item: any) => {
                    const id = item.productId.toString();
                    if (!productSalesCount[id]) {
                        productSalesCount[id] = { count: 0, name: item.name };
                    }
                    productSalesCount[id].count += item.quantity;
                });
            }
        });

        const bestSellingProducts = Object.values(productSalesCount)
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);

        const monthlyGraph = Object.keys(monthlySales).map(k => ({
            month: k,
            revenue: monthlySales[k]
        }));

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                bestSellingProducts,
                monthlyGraph
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
