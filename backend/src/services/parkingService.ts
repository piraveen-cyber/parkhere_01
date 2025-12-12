import ParkingSpot, { IParkingSpot } from '../models/ParkingSpot';
import Booking from '../models/Booking';

export const getAllParkingSpots = async (): Promise<IParkingSpot[]> => {
    return await ParkingSpot.find();
};

export const createParkingSpot = async (data: Partial<IParkingSpot>): Promise<IParkingSpot> => {
    const spot = new ParkingSpot(data);
    return await spot.save();
};

export const getParkingSpotById = async (id: string): Promise<IParkingSpot | null> => {
    return await ParkingSpot.findById(id);
};

export const searchParkingSpots = async (query: string, type?: string, startTime?: Date, endTime?: Date): Promise<IParkingSpot[]> => {
    const filter: any = {};

    if (type && type !== 'all') {
        filter.type = type;
    }

    if (query) {
        filter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { address: { $regex: query, $options: 'i' } }
        ];
    }

    if (startTime && endTime) {
        const bookedSpotIds = await Booking.find({
            status: { $in: ['active', 'pending'] },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        }).distinct('parkingSpotId');

        filter._id = { $nin: bookedSpotIds };
    }

    return await ParkingSpot.find(filter);
};

// Recommendation Logic
export const recommendSpots = async (lat: number, long: number, preference: 'cheapest' | 'nearest' | 'best') => {
    // Get all spots (or filter by radius first if DB supports it, here we fetch all and sort in memory for simplicity)
    const allSpots = await ParkingSpot.find();

    // Check availability for "best" calculation (simplified: assume "now")
    // For a real app, we'd check active bookings overlaps.
    // Let's assume we want available spots right now.
    const now = new Date();
    const activeBookings = await Booking.find({
        status: { $in: ['active', 'pending'] },
        endTime: { $gt: now },
        startTime: { $lt: now }
    }).distinct('parkingSpotId');

    // Map to simple objects with distance
    const candidates = allSpots.map(spot => {
        const isOccupied = activeBookings.some(id => id.toString() === spot._id.toString());
        const distance = Math.sqrt(Math.pow(spot.latitude - lat, 2) + Math.pow(spot.longitude - long, 2)); // Euclidean simple
        return { ...spot.toObject(), distance, isOccupied };
    });

    let results = candidates.filter(s => !s.isOccupied); // Prefer available
    // If no available, fallback to occupied (waiting time logic could apply here)
    if (results.length === 0) results = candidates;

    if (preference === 'cheapest') {
        results.sort((a, b) => a.pricePerHour - b.pricePerHour);
    } else if (preference === 'nearest') {
        results.sort((a, b) => a.distance - b.distance);
    } else {
        // "Best": Balance distance and price. Weighted score.
        // Lower score is better.
        // Score = (Price * 0.7) + (Distance * 100 * 0.3) -> Normalization needed really.
        // Heuristic: Price is king?
        results.sort((a, b) => (a.pricePerHour + a.distance * 10) - (b.pricePerHour + b.distance * 10));
    }

    return results;
};
