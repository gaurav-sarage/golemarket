import mongoose, { Document, Schema } from 'mongoose';

export interface IShop extends Document {
    name: string;
    description: string;
    section: mongoose.Types.ObjectId;
    owner: mongoose.Types.ObjectId;
    contactEmail: string;
    contactPhone: string;
    shopType: 'restaurant' | 'grocery' | 'cafes' | 'salons' | 'auto' | 'general stores' | 'others';
    slug: string;
    businessHours?: string;
    logoImage?: string;
    bannerImage?: string;
    status: 'active' | 'inactive';
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

const ShopSchema: Schema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    section: { type: Schema.Types.ObjectId, ref: 'Section', required: true, index: true },
    owner: { type: Schema.Types.ObjectId, ref: 'ShopOwner', required: true, index: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    shopType: {
        type: String,
        enum: ['restaurant', 'grocery', 'cafes', 'salons', 'auto', 'general stores', 'others'],
        required: true
    },
    slug: { type: String, required: true, unique: true },
    businessHours: { type: String },
    logoImage: { type: String },
    bannerImage: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    rating: { type: Number, default: 0 }
}, { timestamps: true });

export const Shop = (mongoose.models.Shop as mongoose.Model<IShop>) || mongoose.model<IShop>("Shop", ShopSchema);
