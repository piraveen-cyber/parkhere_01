import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceType extends Document {
    name: string; // 'PARKING', 'MECHANIC', etc.
    slug: string; // 'parking', 'mechanic'
    isActive: boolean;
    commissionPercentage: number;
    description?: string;
}

const ServiceTypeSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    isActive: { type: Boolean, default: true },
    commissionPercentage: { type: Number, default: 10, min: 0, max: 100 },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model<IServiceType>('ServiceType', ServiceTypeSchema);
