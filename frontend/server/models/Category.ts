import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
    shopId: mongoose.Types.ObjectId;
    name: string;
    description?: string;
}

const CategorySchema: Schema = new Schema({
    shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String }
}, { timestamps: true });

export const Category = (mongoose.models.Category as mongoose.Model<ICategory>) || mongoose.model<ICategory>("Category", CategorySchema);
