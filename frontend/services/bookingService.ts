import api from './api';

export interface Booking {
    _id?: string;
    userId: string;
    parkingSpotId: any; // Populated or ID
    startTime: Date;
    endTime: Date;
    totalPrice: number;
    status: 'pending' | 'active' | 'completed' | 'cancelled';
    actualCheckInTime?: string;
    actualCheckOutTime?: string;
}

export const createBooking = async (bookingData: Booking): Promise<Booking> => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
};

export const getUserBookings = async (userId: string): Promise<Booking[]> => {
    const response = await api.get(`/bookings/${userId}`);
    return response.data;
};

export const getActiveBooking = async (userId: string): Promise<Booking | null> => {
    // Filter locally or fetch specific active endpoint. 
    // For now assuming getUserBookings returns all, we filter here for simplicity until backend endpoint exists.
    const response = await api.get(`/bookings/${userId}`);
    const bookings: Booking[] = response.data;

    // Return first 'active' or 'pending' booking
    return bookings.find(b => b.status === 'active' || b.status === 'pending') || null;
};

export const scanBooking = async (bookingId: string) => {
    const response = await api.post('/bookings/scan', { bookingId });
    return response.data;
};

export const extendBooking = async (bookingId: string, extraHours: number) => {
    const response = await api.post(`/bookings/${bookingId}/extend`, { extraHours });
    return response.data;
};
