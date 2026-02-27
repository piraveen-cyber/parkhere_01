import { Request, Response } from 'express';
import ServiceRequest, { IServiceRequest } from '../models/ServiceRequest';

export const createServiceRequest = async (req: Request, res: Response) => {
    try {
        const { userId, bookingId, serviceType, location, notes } = req.body;

        if (!userId || !serviceType) {
            return res.status(400).json({ message: 'User ID and Service Type are required' });
        }

        const newRequest = new ServiceRequest({
            userId,
            bookingId,
            serviceType,
            location,
            notes,
            status: 'pending' // Default
        });

        const savedRequest = await newRequest.save();
        res.status(201).json(savedRequest);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserRequests = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const requests = await ServiceRequest.find({ userId }).sort({ createdAt: -1 });
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAllRequests = async (req: Request, res: Response) => {
    try {
        // Admin or Staff endpoint
        const requests = await ServiceRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const updateRequestStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, price } = req.body;

        const updatedRequest = await ServiceRequest.findByIdAndUpdate(
            id,
            { status, price },
            { new: true }
        );

        if (!updatedRequest) {
            return res.status(404).json({ message: 'Service Request not found' });
        }

        res.json(updatedRequest);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
