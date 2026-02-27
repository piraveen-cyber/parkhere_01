import api from './api';

export interface ParkingSpot {

    _id: string;
    name: string;
    latitude: number;
    longitude: number;
    type: string;
    pricePerHour: number;
    isAvailable: boolean;
    address?: string;
    description?: string;
    features?: string[];
    capacity?: {
        car: number;
        bike: number;
        ev: number;
        heavy: number;
    };
}

export const getParkingSpots = async (): Promise<ParkingSpot[]> => {
    try {
        const response = await api.get('/parking');
        return response.data;
    } catch (e) {
        console.warn("API Error (getParkingSpots): returning mock data", e);
        return [
            {
                _id: '1',
                name: 'Colombo City Center',
                latitude: 6.9271,
                longitude: 79.8612,
                type: 'indoor',
                pricePerHour: 200,
                isAvailable: true,
                address: '137 Sir James Pieris Mw, Colombo',
                description: 'Premium indoor parking with 24/7 security.',
                capacity: { car: 50, bike: 20, ev: 5, heavy: 0 },
                features: ['cctv', 'security', 'covered', '247']
            },
            {
                _id: '2',
                name: 'Galle Face Green Lot',
                latitude: 6.9271,
                longitude: 79.8613,
                type: 'outdoor',
                pricePerHour: 100,
                isAvailable: false,
                address: 'Galle Main Rd, Colombo',
                description: 'Open air parking near the beach.',
                capacity: { car: 30, bike: 10, ev: 0, heavy: 2 },
                features: ['security']
            },
        ];
    }
};

export const createParkingSpot = async (spotData: Partial<ParkingSpot>): Promise<ParkingSpot> => {
    try {
        const response = await api.post('/parking', spotData);
        return response.data;
    } catch (e) {
        console.warn("API Error (createParkingSpot): returning mock data", e);
        // MOCK FALLBACK
        return {
            _id: Math.random().toString(36).substr(2, 9),
            name: spotData.name || 'Mock Spot',
            latitude: spotData.latitude || 0,
            longitude: spotData.longitude || 0,
            type: spotData.type || 'indoor',
            pricePerHour: spotData.pricePerHour || 0,
            isAvailable: true,
            address: spotData.address,
            description: spotData.description,
            features: spotData.features,
            capacity: spotData.capacity
        };
    }
};

export const updateParkingSpot = async (id: string, spotData: Partial<ParkingSpot>): Promise<ParkingSpot> => {
    try {
        const response = await api.put(`/parking/${id}`, spotData);
        return response.data;
    } catch (e) {
        console.warn("API Error (updateParkingSpot): returning success", e);
        // MOCK SUCCESS
        return { _id: id, ...spotData } as ParkingSpot;
    }
};

export const deleteParkingSpot = async (id: string): Promise<void> => {
    try {
        await api.delete(`/parking/${id}`);
    } catch (e) {
        console.warn("API Error (deleteParkingSpot): returning success", e);
    }
};
