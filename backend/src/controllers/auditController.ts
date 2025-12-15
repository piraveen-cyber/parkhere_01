import { Request, Response } from 'express';
import AuditLog from '../models/AuditLog';

// Get Audit Logs (Admin only)
export const getAuditLogs = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate, action, targetType, limit } = req.query;

        const query: any = {};

        if (action) query.action = action;
        if (targetType) query.targetType = targetType;

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate as string);
            if (endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        const logs = await AuditLog.find(query)
            .sort({ createdAt: -1 })
            .limit(Number(limit) || 100)
            .populate('adminId', 'name email'); // Populate admin details

        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching audit logs', error });
    }
};
