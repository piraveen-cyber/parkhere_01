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
}

export const getParkingSpots = async (): Promise<ParkingSpot[]> => {
    const response = await api.get('/parking');
    return response.data;
};

export const createParkingSpot = async (spotData: Partial<ParkingSpot>): Promise<ParkingSpot> => {
    const response = await api.post('/parking', spotData);
    return response.data;
};
