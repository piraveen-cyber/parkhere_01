import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
    userId: string; // Supabase User ID (Link to auth)
    businessName: string;
    email: string;
    phone: string;
    serviceTypes: mongoose.Types.ObjectId[]; // Array of ServiceType IDs
    kycDocuments: {
        docType: string;
        url: string;
        status: 'pending' | 'approved' | 'rejected';
    }[];
    kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const PartnerSchema: Schema = new Schema({
    userId: { type: String, required: true, unique: true },
    businessName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceTypes: [{ type: Schema.Types.ObjectId, ref: 'ServiceType' }],
    kycDocuments: [{
        docType: { type: String, required: true },
        url: { type: String, required: true },
        status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
    }],
    kycStatus: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IPartner>('Partner', PartnerSchema);
