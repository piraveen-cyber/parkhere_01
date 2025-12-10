import ParkingSpot, { IParkingSpot } from '../models/ParkingSpot';

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

export const searchParkingSpots = async (query: string, type?: string): Promise<IParkingSpot[]> => {
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

    return await ParkingSpot.find(filter);
};
