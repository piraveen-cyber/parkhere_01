import { Request, Response } from 'express';
import * as parkingService from '../services/parkingService';

export const getParkingSpots = async (req: Request, res: Response) => {
    try {
        const { search, type } = req.query;

        if (search || type) {
            const spots = await parkingService.searchParkingSpots(search as string, type as string);
            res.json(spots);
        } else {
            const spots = await parkingService.getAllParkingSpots();
            res.json(spots);
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createParkingSpot = async (req: Request, res: Response) => {
    try {
        const spot = await parkingService.createParkingSpot(req.body);
        res.status(201).json(spot);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getParkingSpotById = async (req: Request, res: Response) => {
    try {
        const spot = await parkingService.getParkingSpotById(req.params.id);
        if (!spot) return res.status(404).json({ message: 'Spot not found' });
        res.json(spot);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
