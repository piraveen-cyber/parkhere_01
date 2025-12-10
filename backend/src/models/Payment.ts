import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
    userId: string;
    bookingId?: string; // Optional, maybe pre-booking payment
    amount: number;
    currency: string;
    method: string; // 'card', 'cash', etc.
    status: 'pending' | 'completed' | 'failed';
    timestamp: Date;
}

const PaymentSchema: Schema = new Schema({
    userId: { type: String, required: true },
    bookingId: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'LKR' },
    method: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    timestamp: { type: Date, default: Date.now },
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);
