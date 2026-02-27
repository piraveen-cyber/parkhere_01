import { Request, Response } from 'express';
import * as bookingService from '../services/bookingService';

export const createBooking = async (req: Request, res: Response) => {
    try {
        const savedBooking = await bookingService.createBooking(req.body);
        res.status(201).json(savedBooking);
    } catch (error: any) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: error.message || 'Error creating booking' });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getBookingsByUser(req.params.userId);
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

export const scanBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const result = await bookingService.processScan(bookingId);
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const extendBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { extraHours } = req.body;

        if (!bookingId || !extraHours) {
            return res.status(400).json({ message: 'Booking ID and extra hours are required' });
        }

        const result = await bookingService.extendBooking(bookingId, parseInt(extraHours));
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
