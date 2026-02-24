import { Request, Response } from 'express';
import { Shop } from '../models/Shop';
import { Section } from '../models/Section';
import Joi from 'joi';

export const getShops = async (req: Request, res: Response): Promise<void> => {
    try {
        const { section, type, search } = req.query;
        let query: any = { status: 'active' };

        if (section) {
            const sec = await Section.findOne({ name: new RegExp('^' + section + '$', 'i') });
            if (sec) query.section = sec._id;
        }
        if (type) query.shopType = type;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const shops = await Shop.find(query).populate('section', 'name').exec();
        res.status(200).json({ success: true, count: shops.length, data: shops });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getShopById = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop = await Shop.findById(req.params.id).populate('section', 'name').exec();
        if (!shop) { res.status(404).json({ success: false, message: 'Shop not found' }); return; }
        res.status(200).json({ success: true, data: shop });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getSections = async (req: Request, res: Response): Promise<void> => {
    try {
        const sections = await Section.find();
        res.status(200).json({ success: true, count: sections.length, data: sections });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateShopProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        let shop = await Shop.findById(req.params.id);
        if (!shop) { res.status(404).json({ success: false, message: 'Shop not found' }); return; }

        if (shop.owner.toString() !== (req as any).user.id && (req as any).user.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized to update this shop' });
            return;
        }

        const updates = { ...req.body };

        // Handle file uploads if any
        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (files['logo']?.[0]) {
                const b64 = Buffer.from(files['logo'][0].buffer).toString('base64');
                updates.logoImage = `data:${files['logo'][0].mimetype};base64,${b64}`;
            }

            if (files['banner']?.[0]) {
                const b64 = Buffer.from(files['banner'][0].buffer).toString('base64');
                updates.bannerImage = `data:${files['banner'][0].mimetype};base64,${b64}`;
            }
        }

        // Handle category to section mapping if category is updated
        if (updates.shopType) {
            let sectionName = updates.shopType === 'others' ? 'Others' : updates.shopType.charAt(0).toUpperCase() + updates.shopType.slice(1);
            let section = await Section.findOne({ name: sectionName });
            if (!section) {
                section = await Section.create({ name: sectionName, description: `${sectionName} shops` });
            }
            updates.section = section._id;
        }

        shop = await Shop.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        res.status(200).json({ success: true, data: shop });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyShop = async (req: Request, res: Response): Promise<void> => {
    try {
        const shop = await Shop.findOne({ owner: (req as any).user.id }).populate('section', 'name');
        if (!shop) { res.status(404).json({ success: false, message: 'No shop associated with this owner' }); return; }
        res.status(200).json({ success: true, data: shop });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createShop = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user.id;
        let shop = await Shop.findOne({ owner: userId });
        if (shop) {
            res.status(400).json({ success: false, message: 'You already have a shop created' });
            return;
        }

        const { name, description, contactPhone, contactEmail, category, slug, businessHours } = req.body;

        const safeCategory = category || 'others';
        let sectionName = safeCategory === 'others' ? 'Others' : safeCategory.charAt(0).toUpperCase() + safeCategory.slice(1);

        let section = await Section.findOne({ name: sectionName });
        if (!section) {
            section = await Section.create({ name: sectionName, description: `${sectionName} shops` });
        }

        let logoImage = '';
        if (req.file) {
            const b64 = Buffer.from(req.file.buffer).toString('base64');
            logoImage = `data:${req.file.mimetype};base64,${b64}`;
        }

        shop = await Shop.create({
            name,
            description,
            contactPhone,
            contactEmail,
            shopType: safeCategory,
            slug,
            businessHours,
            owner: userId,
            section: section._id,
            logoImage,
            status: 'active'
        });

        res.status(201).json({ success: true, data: shop });
    } catch (err: any) {
        res.status(500).json({ success: false, message: err.message });
    }
};
