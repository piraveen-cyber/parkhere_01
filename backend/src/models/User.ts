import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
    supabaseId: string;
    name: string;
    email?: string;
    phone?: string;
    gender?: string;
    vehiclePlate?: string;
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
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
