import { Request, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { Order, ShopOrder } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Payment } from '../models/Payment';
import { InventoryLog } from '../models/InventoryLog';

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret'
});

export const checkout = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        const { shippingAddress } = req.body;

        const cart = await Cart.findOne({ userId }).populate('shops.items.productId');
        if (!cart || cart.shops.length === 0) {
            res.status(400).json({ success: false, message: 'Cart is empty' });
            return;
        }

        let totalAmount = 0;
        const itemsData = [];

        for (const shop of cart.shops) {
            for (const item of shop.items) {
                const product = await Product.findById(item.productId);
                if (!product || product.stockQuantity < item.quantity) {
                    throw new Error(`Product ${product?.name || item.productId} is out of stock or insufficient quantity`);
                }
                totalAmount += item.quantity * item.price;
            }
        }

        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // paise
            currency: 'INR',
            receipt: `receipt_${Date.now()}`
        });

        const [order] = await Order.create([{
            userId,
            totalAmount,
            status: 'Pending',
            shippingAddress
        }]);

        const shopOrders = [];
        for (const shop of cart.shops) {
            let shopTotal = 0;
            const items = shop.items.map((i: any) => {
                shopTotal += i.quantity * i.price;
                return {
                    productId: i.productId._id,
                    name: i.productId.name,
                    quantity: i.quantity,
                    price: i.price
                };
            });

            shopOrders.push({
                orderId: order._id,
                shopId: shop.shopId,
                userId,
                items,
                totalAmount: shopTotal,
                status: 'Pending'
            });
        }
        await ShopOrder.insertMany(shopOrders);

        await Payment.create({
            orderId: order._id,
            userId,
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount,
            status: 'created'
        });

        res.status(200).json({
            success: true,
            data: {
                order,
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                key: process.env.RAZORPAY_KEY_ID
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        const userId = (req as any).user.id;

        const payment = await Payment.findOne({ razorpayOrderId });
        if (!payment) { res.status(404).json({ success: false, message: 'Payment record not found' }); return; }

        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            payment.status = 'failed';
            await payment.save();
            await Order.findByIdAndUpdate(payment.orderId, { status: 'Failed' });
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
            return;
        }

        payment.status = 'success';
        payment.razorpayPaymentId = razorpayPaymentId;
        payment.razorpaySignature = razorpaySignature;
        await payment.save();

        await Order.findByIdAndUpdate(payment.orderId, { status: 'Paid', paymentId: payment._id });

        const shopOrders = await ShopOrder.find({ orderId: payment.orderId });
        for (const shopOrder of shopOrders) {
            shopOrder.status = 'Paid';
            await shopOrder.save();

            for (const item of shopOrder.items) {
                const product = await Product.findOneAndUpdate(
                    { _id: item.productId, stockQuantity: { $gte: item.quantity } },
                    { $inc: { stockQuantity: -item.quantity } },
                    { new: true }
                );

                if (product) {
                    await InventoryLog.create({
                        productId: item.productId,
                        shopId: shopOrder.shopId,
                        quantityChanged: -item.quantity,
                        newQuantity: product.stockQuantity,
                        reason: 'sale',
                        referenceId: payment.orderId
                    });
                }
            }
        }

        await Cart.findOneAndUpdate({ userId }, { shops: [], totalPrice: 0 });

        res.status(200).json({ success: true, message: 'Payment verified and order processed' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getUserOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const orders = await Order.find({ userId: (req as any).user.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getShopOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shopId } = req.params;
        const shopOrders = await ShopOrder.find({ shopId }).sort('-createdAt').populate('userId', 'name email');
        res.status(200).json({ success: true, count: shopOrders.length, data: shopOrders });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
