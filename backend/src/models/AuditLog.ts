import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
    adminId: mongoose.Types.ObjectId;
    action: string;
    targetType: string; // 'PARTNER', 'BOOKING', 'SYSTEM_CONFIG'
    targetId: string;
    beforeValue?: any;
    afterValue?: any;
    metadata?: any;
    ipAddress?: string;
    userAgent?: string;
    createdAt: Date;
}

const AuditLogSchema: Schema = new Schema({
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    action: { type: String, required: true }, // e.g., 'APPROVE_PARTNER'
    targetType: { type: String, required: true },
    targetId: { type: String, required: true },
    beforeValue: { type: Schema.Types.Mixed },
    afterValue: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed },
    ipAddress: { type: String },
    userAgent: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } }); // Immutable

export default mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
