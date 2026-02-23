import mongoose, { Document, Schema } from 'mongoose';

export interface IShopOrder extends Document {
    orderId: mongoose.Types.ObjectId; // Reference to unified order
    shopId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    items: {
        productId: mongoose.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    status: 'Pending' | 'Paid' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Refunded';
    createdAt: Date;
    updatedAt: Date;
}

const ShopOrderSchema: Schema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Refunded'],
        default: 'Pending',
        index: true
    }
}, { timestamps: true });

export const ShopOrder = (mongoose.models.ShopOrder as mongoose.Model<IShopOrder>) || mongoose.model<IShopOrder>("ShopOrder", ShopOrderSchema);

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    paymentId?: mongoose.Types.ObjectId;
    totalAmount: number;
    status: 'Pending' | 'Paid' | 'Failed';
    shippingAddress: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    paymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
    totalAmount: { type: Number, required: true },
    status: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true }
    }
}, { timestamps: true });

export const Order = (mongoose.models.Order as mongoose.Model<IOrder>) || mongoose.model<IOrder>("Order", OrderSchema);
