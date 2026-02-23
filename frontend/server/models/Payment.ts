import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
    orderId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    razorpaySignature?: string;
    amount: number;
    status: 'created' | 'success' | 'failed' | 'refunded';
    metadata?: any;
    createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
    orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['created', 'success', 'failed', 'refunded'], default: 'created' },
    metadata: { type: Schema.Types.Mixed }
}, { timestamps: true });

export const Payment = (mongoose.models.Payment as mongoose.Model<IPayment>) || mongoose.model<IPayment>("Payment", PaymentSchema);
