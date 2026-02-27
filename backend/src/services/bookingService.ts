import Booking, { IBooking } from '../models/Booking';

export const createBooking = async (bookingData: Partial<IBooking>): Promise<IBooking> => {
    const newBooking = new Booking(bookingData);
    return await newBooking.save();
};

export const getBookingsByUser = async (userId: string): Promise<IBooking[]> => {
    return await Booking.find({ userId }).populate('parkingSpotId');
};
