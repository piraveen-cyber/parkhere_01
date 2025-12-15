import mongoose, { Schema, Document } from 'mongoose';

export interface ISystemConfig extends Document {
    key: string;
    value: any;
    serviceTypeId?: mongoose.Types.ObjectId;
    updatedBy: mongoose.Types.ObjectId; // Admin ID
    description?: string;
}

const SystemConfigSchema: Schema = new Schema({
    key: { type: String, required: true, unique: true },
    value: { type: Schema.Types.Mixed, required: true },
    serviceTypeId: { type: Schema.Types.ObjectId, ref: 'ServiceType', required: false },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    description: { type: String },
}, { timestamps: true });

export default mongoose.model<ISystemConfig>('SystemConfig', SystemConfigSchema);
