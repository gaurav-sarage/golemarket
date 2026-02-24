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
    businessHours: {
        day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
        open: string;
        close: string;
        isClosed: boolean;
    }[];
    logoImage?: string;
    bannerImage?: string;
    status: 'active' | 'inactive' | 'open' | 'closed';
    rating: number;
    address?: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        coordinates?: { lat: number; lng: number };
    };
    deliveryType: 'delivery' | 'pickup' | 'both';
    minimumOrderAmount: number;
    deliveryCharges: number;
    serviceRadius: number; // in km
    policies?: {
        returnPolicy: string;
        deliveryPolicy: string;
    };
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
    businessHours: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], required: true },
        open: { type: String, default: '09:00 AM' },
        close: { type: String, default: '10:00 PM' },
        isClosed: { type: Boolean, default: false }
    }],
    logoImage: { type: String },
    bannerImage: { type: String },
    status: { type: String, enum: ['active', 'inactive', 'open', 'closed'], default: 'open' },
    rating: { type: Number, default: 0 },
    address: {
        street: { type: String },
        city: { type: String },
        state: { type: String },
        zipCode: { type: String },
        coordinates: {
            lat: { type: Number },
            lng: { type: Number }
        }
    },
    deliveryType: { type: String, enum: ['delivery', 'pickup', 'both'], default: 'both' },
    minimumOrderAmount: { type: Number, default: 0 },
    deliveryCharges: { type: Number, default: 0 },
    serviceRadius: { type: Number, default: 5 },
    policies: {
        returnPolicy: { type: String },
        deliveryPolicy: { type: String }
    }
}, { timestamps: true });

export const Shop = (mongoose.models.Shop as mongoose.Model<IShop>) || mongoose.model<IShop>("Shop", ShopSchema);
