import mongoose, { Schema, Document } from 'mongoose';

export interface IServiceRequest extends Document {
    userId: string;
    bookingId?: mongoose.Types.ObjectId; // Optional: linked to a booking
    serviceType: 'mechanic' | 'towing' | 'ev_charging' | 'car_wash' | 'battery_jump' | 'tyre_puncture';
    status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
    location?: string; // For towing or if not in a specific spot
    notes?: string;
    price?: number;
}

const ServiceRequestSchema: Schema = new Schema({
    userId: { type: String, required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking' },
    serviceType: {
        type: String,
        enum: [
            // Standard
            'mechanic', 'towing', 'ev_charging', 'car_wash', 'battery_jump', 'tyre_puncture',
            // Light Vehicle
            'engine', 'tire', 'jump', 'wash',
            // Heavy Vehicle
            'heavy_tow', 'air_brake', 'hydraulics', 'tire_heavy',
            // EV
            'charge', 'battery_swap', 'sw_update', 'port_check'
        ],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
        default: 'pending'
    },
    location: { type: String },
    notes: { type: String },
    price: { type: Number, default: 0 }
}, {
    timestamps: true
});

export default mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);
