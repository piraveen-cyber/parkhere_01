"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSystemConfig = exports.getSystemConfig = exports.getDashboardStats = exports.updateService = exports.getAllServices = exports.updatePartnerKYC = exports.getAllPartners = void 0;
const Partner_1 = __importDefault(require("../models/Partner"));
const ServiceType_1 = __importDefault(require("../models/ServiceType"));
const Booking_1 = __importDefault(require("../models/Booking"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
// @desc    Get all partners with filters
// @route   GET /api/admin/partners
const getAllPartners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partners = yield Partner_1.default.find().sort({ createdAt: -1 });
        res.json(partners);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllPartners = getAllPartners;
// @desc    Approve or Reject Partner
// @route   PUT /api/admin/partners/:id/kyc
const updatePartnerKYC = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { status } = req.body; // APPROVED or REJECTED
    try {
        const partner = yield Partner_1.default.findById(req.params.id);
        if (!partner)
            return res.status(404).json({ message: 'Partner not found' });
        partner.kycStatus = status;
        if (status === 'APPROVED')
            partner.isActive = true;
        yield partner.save();
        // Audit Log
        yield AuditLog_1.default.create({
            adminId: req.admin._id,
            action: `PARTNER_KYC_${status}`,
            targetType: 'PARTNER',
            targetId: partner._id,
        });
        res.json(partner);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updatePartnerKYC = updatePartnerKYC;
// @desc    Get all service types
// @route   GET /api/admin/services
const getAllServices = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const services = yield ServiceType_1.default.find();
        res.json(services);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getAllServices = getAllServices;
// @desc    Update Service Commission
// @route   PUT /api/admin/services/:id
const updateService = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { commissionPercentage, isActive } = req.body;
    try {
        const service = yield ServiceType_1.default.findById(req.params.id);
        if (!service)
            return res.status(404).json({ message: 'Service not found' });
        if (commissionPercentage !== undefined)
            service.commissionPercentage = commissionPercentage;
        if (isActive !== undefined)
            service.isActive = isActive;
        yield service.save();
        yield AuditLog_1.default.create({
            adminId: req.admin._id,
            action: 'UPDATE_SERVICE',
            targetType: 'SERVICE_TYPE',
            targetId: service._id,
            metadata: { commissionPercentage, isActive }
        });
        res.json(service);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateService = updateService;
// @desc    Get Dashboard Stats
// @route   GET /api/admin/stats
const getDashboardStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalPartners = yield Partner_1.default.countDocuments();
        const pendingPartners = yield Partner_1.default.countDocuments({ kycStatus: 'PENDING' });
        const totalBookings = yield Booking_1.default.countDocuments();
        const revenue = yield Booking_1.default.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$platformEarning' } } }
        ]);
        res.json({
            partners: { total: totalPartners, pending: pendingPartners },
            bookings: { total: totalBookings },
            revenue: revenue[0] ? revenue[0].total : 0
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getDashboardStats = getDashboardStats;
// @desc    Get System Config
// @route   GET /api/admin/config
const getSystemConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Need SystemConfig model
        const configs = yield Promise.resolve().then(() => __importStar(require('../models/SystemConfig'))).then(mod => mod.default.find());
        res.json(configs);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.getSystemConfig = getSystemConfig;
// @desc    Update System Config
// @route   PUT /api/admin/config/:key
const updateSystemConfig = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { value, description } = req.body;
    try {
        const SystemConfig = (yield Promise.resolve().then(() => __importStar(require('../models/SystemConfig')))).default;
        const config = yield SystemConfig.findOne({ key: req.params.key });
        if (config) {
            config.value = value;
            config.updatedBy = req.admin._id;
            if (description)
                config.description = description;
            yield config.save();
        }
        else {
            yield SystemConfig.create({
                key: req.params.key,
                value,
                updatedBy: req.admin._id,
                description
            });
        }
        yield AuditLog_1.default.create({
            adminId: req.admin._id,
            action: 'UPDATE_CONFIG',
            targetType: 'SYSTEM_CONFIG',
            targetId: req.params.key,
            metadata: { value }
        });
        res.json({ message: 'Config updated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
exports.updateSystemConfig = updateSystemConfig;
