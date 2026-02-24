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
        const { shippingAddress, phoneNumber } = req.body;

        // Check for required environment variables
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            console.error("Missing Razorpay credentials in environment");
            res.status(500).json({
                success: false,
                message: 'Payment gateway configuration missing. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.'
            });
            return;
        }

        const cart = await Cart.findOne({ userId }).populate('shops.items.productId');
        if (!cart || cart.shops.length === 0) {
            res.status(400).json({ success: false, message: 'Cart is empty' });
            return;
        }

        let totalAmount = 0;
        for (const shop of cart.shops) {
            for (const item of shop.items) {
                const product = item.productId as any;
                if (!product || product.stockQuantity < item.quantity) {
                    res.status(400).json({
                        success: false,
                        message: `Product "${product?.name || 'Unknown'}" is out of stock`
                    });
                    return;
                }
                const price = item.price || product.price || 0;
                totalAmount += item.quantity * price;
            }
        }

        if (isNaN(totalAmount) || totalAmount <= 0) {
            res.status(400).json({ success: false, message: 'Invalid total amount in cart' });
            return;
        }

        // Add 5% GST and Handling Fee
        const tax = Math.round(totalAmount * 0.05);
        const handlingFee = 15;
        const finalAmount = totalAmount + tax + handlingFee;

        console.log(`Initialising Razorpay order for ${finalAmount} INR (including GST and Handling)`);

        let razorpayOrder;
        try {
            razorpayOrder = await razorpay.orders.create({
                amount: finalAmount * 100, // paise
                currency: 'INR',
                receipt: `receipt_${Date.now()}`
            });
        } catch (rzpErr: any) {
            console.error("Razorpay Order Creation Failed:", rzpErr);
            res.status(500).json({
                success: false,
                message: `Razorpay Error: ${rzpErr.description || rzpErr.error?.description || rzpErr.message || 'Verification failed at gateway'}`
            });
            return;
        }

        const [order] = await Order.create([{
            userId,
            totalAmount: finalAmount,
            status: 'Pending',
            shippingAddress,
            phoneNumber
        }]);

        const shopOrders = [];
        for (const shop of cart.shops) {
            let shopTotal = 0;
            const items = shop.items.map((i: any) => {
                const product = i.productId as any;
                const price = i.price || product?.price || 0;
                shopTotal += i.quantity * price;
                return {
                    productId: product?._id || i.productId,
                    name: product?.name || 'Unknown Product',
                    quantity: i.quantity || 0,
                    price: price
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
            amount: finalAmount,
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
        console.error("Checkout Controller Exception:", err);
        res.status(500).json({ success: false, message: err.message || 'System error during checkout' });
    }
};

// Shared fulfillment logic
const fulfillOrder = async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature?: string) => {
    const payment = await Payment.findOne({ razorpayOrderId });
    if (!payment || payment.status === 'success') return;

    payment.status = 'success';
    payment.razorpayPaymentId = razorpayPaymentId;
    if (razorpaySignature) payment.razorpaySignature = razorpaySignature;
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

    await Cart.findOneAndUpdate({ userId: payment.userId }, { shops: [], totalPrice: 0 });
};

export const verifyPayment = async (req: Request, res: Response): Promise<void> => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        const body = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'dummy_secret')
            .update(body.toString())
            .digest('hex');

        if (expectedSignature !== razorpaySignature) {
            const payment = await Payment.findOne({ razorpayOrderId });
            if (payment) {
                payment.status = 'failed';
                await payment.save();
                await Order.findByIdAndUpdate(payment.orderId, { status: 'Failed' });
            }
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
            return;
        }

        await fulfillOrder(razorpayOrderId, razorpayPaymentId, razorpaySignature);
        res.status(200).json({ success: true, message: 'Payment verified and order processed' });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const handleWebhook = async (req: Request, res: Response): Promise<void> => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'webhook_secret';
    const signature = req.headers['x-razorpay-signature'];

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');

    if (expectedSignature === signature) {
        const { event, payload } = req.body;

        if (event === 'order.paid' || event === 'payment.captured') {
            const orderId = payload.payment.entity.order_id;
            const paymentId = payload.payment.entity.id;
            await fulfillOrder(orderId, paymentId);
        }
        res.status(200).json({ status: 'ok' });
    } else {
        res.status(400).json({ status: 'verification_failed' });
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
