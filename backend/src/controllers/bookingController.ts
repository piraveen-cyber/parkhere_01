import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const { userId, parkingSpotId, startTime, endTime, totalPrice } = req.body;
        // Validation logic could go here or in a separate validator
        const savedBooking = await bookingService.createBooking({
            userId,
            parkingSpotId,
            startTime,
            endTime,
            totalPrice
        } as any);
        res.status(201).json(savedBooking);
    } catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getBookingsByUser(req.params.userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};
