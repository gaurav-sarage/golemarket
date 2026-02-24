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
    categoryName?: string;
    subCategoryName?: string;
    images: string[];
    availabilityStatus: 'in_stock' | 'out_of_stock' | 'discontinued' | 'Available' | 'Out of Stock' | 'Active' | 'Inactive';
    productStatus: 'Draft' | 'Published';
    salePrice?: number;
    taxIndicator?: boolean;
    trackInventory?: boolean;
    deliveryEligibility?: boolean;
    pickupAvailability?: boolean;

    // Type specific fields
    foodCategory?: string; // Veg / Non-Veg / Beverage / Combo
    foodType?: 'Veg' | 'Non-Veg' | 'Egg' | 'Not Applicable';
    preparationTime?: number;
    portionSize?: string;
    stockLimitPerDay?: number;
    spiceLevel?: 'None' | 'Mild' | 'Medium' | 'Hot' | 'Extra Hot';
    isChefSpecial?: boolean;
    isMustTry?: boolean;
    isBestseller?: boolean;

    unitType?: string; // Piece / Pack / Box / Kg / Gram / Litre
    minimumOrderQuantity?: number;
    expiryDate?: Date;

    serviceDuration?: number;
    vehicleCompatibility?: string;
    appointmentRequired?: boolean;
    availableDays?: string;

    variants?: { name: string; value: string; price?: number; stock?: number }[];
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
    categoryName: { type: String },
    subCategoryName: { type: String },
    images: [{ type: String }],
    availabilityStatus: {
        type: String,
        enum: ['in_stock', 'out_of_stock', 'discontinued', 'Available', 'Out of Stock', 'Active', 'Inactive'],
        default: 'in_stock'
    },
    productStatus: {
        type: String,
        enum: ['Draft', 'Published'],
        default: 'Published'
    },
    salePrice: { type: Number },
    taxIndicator: { type: Boolean, default: false },
    trackInventory: { type: Boolean, default: true },
    deliveryEligibility: { type: Boolean, default: true },
    pickupAvailability: { type: Boolean, default: true },

    foodCategory: { type: String },
    foodType: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Egg', 'Not Applicable'],
        default: 'Not Applicable'
    },
    preparationTime: { type: Number },
    portionSize: { type: String },
    stockLimitPerDay: { type: Number },
    spiceLevel: {
        type: String,
        enum: ['None', 'Mild', 'Medium', 'Hot', 'Extra Hot'],
        default: 'None'
    },
    isChefSpecial: { type: Boolean, default: false },
    isMustTry: { type: Boolean, default: false },
    isBestseller: { type: Boolean, default: false },

    unitType: { type: String },
    minimumOrderQuantity: { type: Number },
    expiryDate: { type: Date },

    serviceDuration: { type: Number },
    vehicleCompatibility: { type: String },
    appointmentRequired: { type: Boolean, default: false },
    availableDays: { type: String },

    variants: [{
        name: { type: String },
        value: { type: String },
        price: { type: Number },
        stock: { type: Number }
    }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 }
}, { timestamps: true });

export const Product = (mongoose.models.Product as mongoose.Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);
