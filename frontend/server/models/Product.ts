import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
    shopId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    price: number;
    discount?: number;
    sku: string;
    stockQuantity: number;
    categoryId: mongoose.Types.ObjectId;
    images: string[];
    availabilityStatus: 'in_stock' | 'out_of_stock' | 'discontinued';
    variants?: { name: string; value: string }[];
    rating: number;
    numReviews: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema({
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    name: { type: String, required: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    sku: { type: String, required: true },
    stockQuantity: { type: Number, required: true, min: 0 },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    images: [{ type: String }],
    availabilityStatus: {
        type: String,
        enum: ['in_stock', 'out_of_stock', 'discontinued'],
        default: 'in_stock'
    },
    variants: [{
        name: { type: String },
        value: { type: String }
    }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

export const Product = (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
