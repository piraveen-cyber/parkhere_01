import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
    userId: string;
    parkingSpotId: mongoose.Types.ObjectId;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    actualCheckInTime?: Date;
    actualCheckOutTime?: Date;
    extraFee?: number;
    paymentStatus: 'paid' | 'pending' | 'unpaid' | 'refunded';
}

const BookingSchema: Schema = new Schema({
    userId: { type: String, required: true }, // Supabase User ID
    parkingSpotId: { type: Schema.Types.ObjectId, ref: 'ParkingSpot', required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'active', 'completed', 'cancelled'],
        default: 'pending'
    },
    actualCheckInTime: { type: Date },
    actualCheckOutTime: { type: Date },
    extraFee: { type: Number, default: 0 },
    paymentStatus: {
        type: String,
        enum: ['paid', 'pending', 'unpaid', 'refunded'],
        default: 'paid' // Assuming initial booking is paid
    }
}, {
    timestamps: true
});

export default mongoose.model<IBooking>('Booking', BookingSchema);
