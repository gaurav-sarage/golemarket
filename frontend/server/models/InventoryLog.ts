import mongoose, { Document, Schema } from 'mongoose';

export interface IInventoryLog extends Document {
    productId: mongoose.Types.ObjectId;
    shopId: mongoose.Types.ObjectId;
    quantityChanged: number;
    newQuantity: number;
    reason: 'restock' | 'sale' | 'return' | 'adjustment' | 'damage';
    referenceId?: mongoose.Types.ObjectId; // E.g., Order ID string or objectid
    createdAt: Date;
}

const InventoryLogSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    quantityChanged: { type: Number, required: true },
    newQuantity: { type: Number, required: true },
    reason: {
        type: String,
        enum: ['restock', 'sale', 'return', 'adjustment', 'damage'],
        required: true
    },
    referenceId: { type: Schema.Types.ObjectId }
}, { timestamps: true });

export const InventoryLog = (mongoose.models.InventoryLog as mongoose.Model<IInventoryLog>) || mongoose.model<IInventoryLog>("InventoryLog", InventoryLogSchema);
