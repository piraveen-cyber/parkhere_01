import { Request, Response } from 'express';
import * as parkingService from '../services/parkingService';

export const getParkingSpots = async (req: Request, res: Response) => {
    try {
        const { search, type, startTime, endTime } = req.query;

        let start: Date | undefined;
        let end: Date | undefined;

        if (startTime && endTime) {
            start = new Date(startTime as string);
            end = new Date(endTime as string);
        }

        if (search || type || (start && end)) {
            const spots = await parkingService.searchParkingSpots(search as string, type as string, start, end);
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

export const getRecommendations = async (req: Request, res: Response) => {
    try {
        const { lat, long, type } = req.query;
        if (!lat || !long) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }

        const preference = (type as 'cheapest' | 'nearest' | 'best') || 'best';
        const spots = await parkingService.recommendSpots(parseFloat(lat as string), parseFloat(long as string), preference);

        res.json(spots);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
