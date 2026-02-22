import mongoose, { Document, Schema } from 'mongoose';

export interface ISection extends Document {
    name: string;
    description: string;
    coverImage?: string;
    createdAt: Date;
    updatedAt: Date;
}

const SectionSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    coverImage: { type: String }
}, { timestamps: true });

export const Section = mongoose.model<ISection>('Section', SectionSchema);
