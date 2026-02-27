import mongoose, { Schema, Document } from 'mongoose';

export interface IParkingSpot extends Document {
    name: string;
    latitude: number;
    longitude: number;
    type: 'car' | 'bike' | 'bus' | 'van' | 'threewheel';
    pricePerHour: number;
    isAvailable: boolean;
    address?: string;
    description?: string;
    floor?: number;
    block?: string;
}

const ParkingSpotSchema: Schema = new Schema({
    name: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    type: {
        type: String,
        enum: ['car', 'bike', 'bus', 'van', 'threewheel'],
        default: 'car'
    },
    pricePerHour: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    address: { type: String },
    description: { type: String },
    floor: { type: Number, default: 1 },
    block: { type: String, default: 'A' }
}, {
    timestamps: true
});

export default mongoose.model<IParkingSpot>('ParkingSpot', ParkingSpotSchema);
