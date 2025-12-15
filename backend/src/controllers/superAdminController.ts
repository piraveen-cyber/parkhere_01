import { Request, Response } from 'express';
import Partner from '../models/Partner';
import ServiceType from '../models/ServiceType';
import Booking from '../models/Booking';
import AuditLog from '../models/AuditLog';

// @desc    Get all partners with filters
// @route   GET /api/admin/partners
export const getAllPartners = async (req: Request, res: Response) => {
    try {
        const partners = await Partner.find().sort({ createdAt: -1 });
        res.json(partners);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Approve or Reject Partner
// @route   PUT /api/admin/partners/:id/kyc
export const updatePartnerKYC = async (req: any, res: Response) => {
    const { status } = req.body; // APPROVED or REJECTED

    try {
        const partner = await Partner.findById(req.params.id);
        if (!partner) return res.status(404).json({ message: 'Partner not found' });

        partner.kycStatus = status;
        if (status === 'APPROVED') partner.isActive = true;
        await partner.save();

        // Audit Log
        await AuditLog.create({
            adminId: req.admin._id,
            action: `PARTNER_KYC_${status}`,
            targetType: 'PARTNER',
            targetId: (partner._id as unknown) as string,
        });

        res.json(partner);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all service types
// @route   GET /api/admin/services
export const getAllServices = async (req: Request, res: Response) => {
    try {
        const services = await ServiceType.find();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update Service Commission
// @route   PUT /api/admin/services/:id
export const updateService = async (req: any, res: Response) => {
    const { commissionPercentage, isActive } = req.body;

    try {
        const service = await ServiceType.findById(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });

        if (commissionPercentage !== undefined) service.commissionPercentage = commissionPercentage;
        if (isActive !== undefined) service.isActive = isActive;
        await service.save();

        await AuditLog.create({
            adminId: req.admin._id,
            action: 'UPDATE_SERVICE',
            targetType: 'SERVICE_TYPE',
            targetId: (service._id as unknown) as string,
            metadata: { commissionPercentage, isActive }
        });

        res.json(service);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get Dashboard Stats
// @route   GET /api/admin/stats
export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const totalPartners = await Partner.countDocuments();
        const pendingPartners = await Partner.countDocuments({ kycStatus: 'PENDING' });
        const totalBookings = await Booking.countDocuments();
        const revenue = await Booking.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$platformEarning' } } }
        ]);

        res.json({
            partners: { total: totalPartners, pending: pendingPartners },
            bookings: { total: totalBookings },
            revenue: revenue[0] ? revenue[0].total : 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get System Config
// @route   GET /api/admin/config
export const getSystemConfig = async (req: Request, res: Response) => {
    try {
        // Need SystemConfig model
        const configs = await import('../models/SystemConfig').then(mod => mod.default.find());
        res.json(configs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update System Config
// @route   PUT /api/admin/config/:key
export const updateSystemConfig = async (req: any, res: Response) => {
    const { value, description } = req.body;
    try {
        const SystemConfig = (await import('../models/SystemConfig')).default;
        const config = await SystemConfig.findOne({ key: req.params.key });

        if (config) {
            config.value = value;
            config.updatedBy = req.admin._id;
            if (description) config.description = description;
            await config.save();
        } else {
            await SystemConfig.create({
                key: req.params.key,
                value,
                updatedBy: req.admin._id,
                description
            });
        }

        await AuditLog.create({
            adminId: req.admin._id,
            action: 'UPDATE_CONFIG',
            targetType: 'SYSTEM_CONFIG',
            targetId: req.params.key,
            metadata: { value }
        });

        res.json({ message: 'Config updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
