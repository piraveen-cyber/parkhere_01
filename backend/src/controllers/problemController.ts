import { Request, Response } from 'express';
import ProblemReport from '../models/ProblemReport';
import ProblemNote from '../models/ProblemNote';
import AuditLog from '../models/AuditLog';
import Booking from '../models/Booking';

// Create a new Problem Report
export const createProblemReport = async (req: Request, res: Response) => {
    try {
        const {
            raisedByRole,
            raisedById,
            relatedBookingId,
            serviceTypeId,
            partnerId,
            category,
            description,
            priority
        } = req.body;

        const newReport = new ProblemReport({
            raisedByRole,
            raisedById,
            relatedBookingId,
            serviceTypeId,
            partnerId,
            category,
            description,
            priority: priority || 'LOW', // Default priority, Admin re-evaluates
            status: 'OPEN'
        });

        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ message: 'Error creating problem report', error });
    }
};

// Get all Problem Reports (Admin with filtering)
export const getAllProblemReports = async (req: Request, res: Response) => {
    try {
        const { status, priority, category, serviceTypeId, startDate, endDate } = req.query;

        const query: any = {};

        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;
        if (serviceTypeId) query.serviceTypeId = serviceTypeId;

        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate as string);
            if (endDate) query.createdAt.$lte = new Date(endDate as string);
        }

        const reports = await ProblemReport.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .populate('relatedBookingId'); // Optional: populate booking details

        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problem reports', error });
    }
};

// Get Single Problem Report by ID with Notes
export const getProblemReportById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const report = await ProblemReport.findById(id).populate('relatedBookingId');

        if (!report) {
            return res.status(404).json({ message: 'Problem report not found' });
        }

        const notes = await ProblemNote.find({ problemReportId: id }).sort({ createdAt: 1 });

        res.status(200).json({ report, notes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching problem report details', error });
    }
};

// Update Problem Status
export const updateProblemStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status, adminId } = req.body; // adminId from Auth middleware in real app

        const report = await ProblemReport.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Problem report not found' });
        }

        const oldStatus = report.status;
        report.status = status;
        await report.save();

        // Audit Log
        if (adminId) {
            await AuditLog.create({
                adminId,
                action: 'UPDATE_PROBLEM_STATUS',
                targetType: 'PROBLEM_REPORT',
                targetId: id,
                beforeValue: oldStatus,
                afterValue: status
            });
        }

        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: 'Error updating problem status', error });
    }
};

// Add Internal Note
export const addProblemNote = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { adminId, note } = req.body;

        const newNote = new ProblemNote({
            problemReportId: id,
            adminId,
            note
        });

        await newNote.save();
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: 'Error adding problem note', error });
    }
};
