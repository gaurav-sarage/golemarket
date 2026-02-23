import mongoose, { Document, Schema } from 'mongoose';

export interface IShopOwner extends Document {
    name: string;
    email: string;
    password?: string;
    phone: string;
    role: 'shop_owner';
    status: 'active' | 'inactive' | 'pending';
    isVerified: boolean;
    verificationToken?: string;
    resetPasswordToken?: string;
    resetPasswordExpire?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const ShopOwnerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, default: 'shop_owner' },
    status: { type: String, enum: ['active', 'inactive', 'pending'], default: 'active' },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
}, { timestamps: true });

export const ShopOwner = (mongoose.models.ShopOwner as mongoose.Model<IShopOwner>) || mongoose.model<IShopOwner>("ShopOwner", ShopOwnerSchema);
