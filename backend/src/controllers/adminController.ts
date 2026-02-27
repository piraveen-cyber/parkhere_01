import { Request, Response } from 'express';
import Booking from '../models/Booking';
import User from '../models/User';
import ParkingSpot from '../models/ParkingSpot';

export const getStats = async (req: Request, res: Response) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalBookings = await Booking.countDocuments();
        const totalParkingSpots = await ParkingSpot.countDocuments();

        // Calculate total revenue from active/completed bookings
        const revenueResult = await Booking.aggregate([
            { $match: { status: { $in: ['active', 'completed'] } } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

        res.json({
            totalUsers,
            totalBookings,
            totalParkingSpots,
            totalRevenue
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await Booking.find().populate('parkingSpotId');
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
