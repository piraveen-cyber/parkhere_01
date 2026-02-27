import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    supabaseId: string;
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    vehiclePlate?: string;
    vehicleModel?: string;
    vehicleType?: string;
    vehicleBrand?: string;
    fuelType?: 'petrol' | 'diesel' | 'electric' | 'hybrid';
    transmission?: 'auto' | 'manual';
    avatarUrl?: string; // Profile picture URL
    disabilityStatus?: 'none' | 'pending' | 'verified' | 'rejected';
    disabilityDocumentUrl?: string; // URL to the uploaded document
    role?: 'user' | 'admin';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema({
    supabaseId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    gender: { type: String },
    vehiclePlate: { type: String },
    vehicleModel: { type: String },
    vehicleType: { type: String },
    vehicleBrand: { type: String },
    fuelType: { type: String, enum: ['petrol', 'diesel', 'electric', 'hybrid'] },
    transmission: { type: String, enum: ['auto', 'manual'] },
    avatarUrl: { type: String },
    disabilityStatus: {
        type: String,
        enum: ['none', 'pending', 'verified', 'rejected'],
        default: 'none'
    },
    disabilityDocumentUrl: { type: String },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
