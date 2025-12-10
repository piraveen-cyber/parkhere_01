import api from './api';

export interface Booking {
    _id?: string;
    userId: string;
    parkingSpotId: string;
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status?: string;
}

export const createBooking = async (bookingData: Booking): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/${userId}`);
    return response.data;
};
