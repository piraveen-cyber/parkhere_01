import mongoose, { Schema, Document } from 'mongoose';

export interface IProblemNote extends Document {
    problemReportId: mongoose.Types.ObjectId;
    adminId: mongoose.Types.ObjectId;
    note: string;
    createdAt: Date;
}

const ProblemNoteSchema: Schema = new Schema({
    problemReportId: { type: Schema.Types.ObjectId, ref: 'ProblemReport', required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    note: { type: String, required: true },
}, { timestamps: { createdAt: true, updatedAt: false } });

export default mongoose.model<IProblemNote>('ProblemNote', ProblemNoteSchema);
