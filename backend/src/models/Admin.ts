import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
    email: string;
    passwordHash: string;
    role: 'SUPER_ADMIN' | 'SUB_ADMIN';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AdminSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['SUPER_ADMIN', 'SUB_ADMIN'], default: 'SUPER_ADMIN' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IAdmin>('Admin', AdminSchema);
