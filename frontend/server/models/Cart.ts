import mongoose, { Document, Schema } from 'mongoose';

export interface IShopCart {
    shopId: mongoose.Types.ObjectId;
    shopName?: string;
    items: {
        productId: mongoose.Types.ObjectId;
        quantity: number;
        price: number;
    }[];
}

export interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    shops: IShopCart[];
    totalPrice: number;
    updatedAt: Date;
}

const CartSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    shops: [{
        shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
        shopName: { type: String },
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true }
        }]
    }],
    totalPrice: { type: Number, required: true, default: 0 }
}, { timestamps: true });

export const Cart = (mongoose.models.Cart as mongoose.Model<ICart>) || mongoose.model<ICart>("Cart", CartSchema);
