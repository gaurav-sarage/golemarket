import { Request, Response } from 'express';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { Shop } from '../models/Shop'; // Add Shop import
import mongoose from 'mongoose';

export const getCart = async (req: Request, res: Response): Promise<void> => {
    try {
        let cart = await Cart.findOne({ userId: (req as any).user.id }).populate('shops.items.productId');
        if (!cart) {
            cart = await Cart.create({ userId: (req as any).user.id, shops: [], totalPrice: 0 });
        }
        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const addToCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId, quantity, force = false } = req.body;
        const userId = (req as any).user.id;

        const product = await Product.findById(productId);
        if (!product) { res.status(404).json({ success: false, message: 'Product not found' }); return; }

        const shopId = product.shopId.toString();

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, shops: [], totalPrice: 0 });
        }

        // Check if cart has items from another shop
        if (cart.shops.length > 0 && cart.shops[0].shopId.toString() !== shopId) {
            if (force) {
                cart.shops = [];
                cart.totalPrice = 0;
            } else {
                res.status(400).json({
                    success: false,
                    code: 'DIFFERENT_SHOP',
                    message: 'Your cart contains items from another shop. Would you like to clear it and add this item instead?'
                });
                return;
            }
        }

        const shopIndex = cart.shops.findIndex(s => s.shopId.toString() === shopId);
        if (shopIndex > -1) {
            const itemIndex = cart.shops[shopIndex].items.findIndex(i => i.productId.toString() === productId);
            if (itemIndex > -1) {
                cart.shops[shopIndex].items[itemIndex].quantity += quantity;
            } else {
                cart.shops[shopIndex].items.push({ productId: product._id as any, quantity, price: product.price });
            }
        } else {
            // Fetch shop name for better UI display
            const shop = await Shop.findById(shopId).select('name');
            cart.shops.push({
                shopId: product.shopId,
                shopName: shop?.name || 'Unknown Store',
                items: [{ productId: product._id as any, quantity, price: product.price }]
            });
        }

        cart.totalPrice += product.price * quantity;
        await cart.save();

        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const removeFromCart = async (req: Request, res: Response): Promise<void> => {
    try {
        const { productId } = req.params;
        const userId = (req as any).user.id;

        let cart = await Cart.findOne({ userId });
        if (!cart) { res.status(404).json({ success: false, message: 'Cart not found' }); return; }

        let removedItemPrice = 0;

        cart.shops = cart.shops.map(shop => {
            const itemIndex = shop.items.findIndex((i: any) => i.productId.toString() === productId);
            if (itemIndex > -1) {
                removedItemPrice = shop.items[itemIndex].price * shop.items[itemIndex].quantity;
                shop.items.splice(itemIndex, 1);
            }
            return shop;
        }).filter(shop => shop.items.length > 0) as any;

        cart.totalPrice -= removedItemPrice;
        await cart.save();

        res.status(200).json({ success: true, data: cart });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
