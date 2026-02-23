import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { Shop } from '../models/Shop';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { shopId, categoryId, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
        let query: any = {};

        if (shopId) query.shopId = shopId;
        if (categoryId) query.categoryId = categoryId;
        if (search) query.name = { $regex: search, $options: 'i' };
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product.find(query).skip(skip).limit(Number(limit)).populate('shopId', 'name').exec();
        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: Number(page),
            data: products
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getProductById = async (req: Request, res: Response): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id).populate('shopId', 'name').populate('categoryId', 'name').exec();
        if (!product) { res.status(404).json({ success: false, message: 'Product not found' }); return; }
        res.status(200).json({ success: true, data: product });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop = await Shop.findById(req.body.shopId);
        if (!shop) { res.status(404).json({ success: false, message: 'Shop not found' }); return; }

        if (shop.owner.toString() !== (req as any).user.id) {
            res.status(403).json({ success: false, message: 'Not authorized to add product to this shop' });
            return;
        }

        const payload = { ...req.body };
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            const imageUrl = `data:${req.file.mimetype};base64,${b64}`;
            payload.images = [imageUrl];
        }

        const product = await Product.create(payload);
        res.status(201).json({ success: true, data: product });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) { res.status(404).json({ success: false, message: 'Product not found' }); return; }

        const shop = await Shop.findById(product.shopId);
        if (!shop || shop.owner.toString() !== (req as any).user.id) {
            res.status(403).json({ success: false, message: 'Not authorized to update this product' });
            return;
        }

        product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: product });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    try {
        let product = await Product.findById(req.params.id);
        if (!product) { res.status(404).json({ success: false, message: 'Product not found' }); return; }

        const shop = await Shop.findById(product.shopId);
        if (!shop || shop.owner.toString() !== (req as any).user.id) {
            res.status(403).json({ success: false, message: 'Not authorized to delete this product' });
            return;
        }

        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
