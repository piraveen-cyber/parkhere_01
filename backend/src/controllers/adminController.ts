import { Request, Response } from 'express';
import * as adminService from '../services/adminService';

export const getStats = async (req: Request, res: Response) => {
    try {
        const stats = await adminService.getSystemStats();
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await adminService.getAllBookings();
        res.json(bookings);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await adminService.getAllUsers();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
