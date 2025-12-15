import mongoose, { Schema, Document } from 'mongoose';

export interface IProblemReport extends Document {
    raisedByRole: 'CUSTOMER' | 'PARTNER' | 'DRIVER' | 'SYSTEM';
    raisedById: string; // User ID or Partner ID
    relatedBookingId?: mongoose.Types.ObjectId;
    serviceTypeId?: string;
    partnerId?: string;
    category: 'Payment Issue' | 'Booking Issue' | 'Service Quality Issue' | 'Partner Misconduct' | 'App / Technical Issue' | 'Refund Request' | 'Fraud / Abuse' | 'Other';
    description: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED';
    createdAt: Date;
    updatedAt: Date;
}

const ProblemReportSchema: Schema = new Schema({
    raisedByRole: {
        type: String,
        enum: ['CUSTOMER', 'PARTNER', 'DRIVER', 'SYSTEM'],
        required: true
    },
    raisedById: { type: String, required: true },
    relatedBookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    serviceTypeId: { type: String },
    partnerId: { type: String },
    category: {
        type: String,
        enum: [
            'Payment Issue',
            'Booking Issue',
            'Service Quality Issue',
            'Partner Misconduct',
            'App / Technical Issue',
            'Refund Request',
            'Fraud / Abuse',
            'Other'
        ],
        required: true
    },
    description: { type: String, required: true },
    priority: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
        default: 'LOW'
    },
    status: {
        type: String,
        enum: ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
        default: 'OPEN'
    }
}, { timestamps: true });

export default mongoose.model<IProblemReport>('ProblemReport', ProblemReportSchema);
