import { Request, Response } from 'express';
import * as paymentService from '../services/paymentService';

export const createPayment = async (req: Request, res: Response) => {
    try {
        const payment = await paymentService.processPayment(req.body);
        res.status(201).json(payment);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
