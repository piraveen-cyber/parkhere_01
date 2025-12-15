"use strict";
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
exports.addProblemNote = exports.updateProblemStatus = exports.getProblemReportById = exports.getAllProblemReports = exports.createProblemReport = void 0;
const ProblemReport_1 = __importDefault(require("../models/ProblemReport"));
const ProblemNote_1 = __importDefault(require("../models/ProblemNote"));
const AuditLog_1 = __importDefault(require("../models/AuditLog"));
// Create a new Problem Report
const createProblemReport = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { raisedByRole, raisedById, relatedBookingId, serviceTypeId, partnerId, category, description, priority } = req.body;
        const newReport = new ProblemReport_1.default({
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
        yield newReport.save();
        res.status(201).json(newReport);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating problem report', error });
    }
});
exports.createProblemReport = createProblemReport;
// Get all Problem Reports (Admin with filtering)
const getAllProblemReports = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status, priority, category, serviceTypeId, startDate, endDate } = req.query;
        const query = {};
        if (status)
            query.status = status;
        if (priority)
            query.priority = priority;
        if (category)
            query.category = category;
        if (serviceTypeId)
            query.serviceTypeId = serviceTypeId;
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = new Date(startDate);
            if (endDate)
                query.createdAt.$lte = new Date(endDate);
        }
        const reports = yield ProblemReport_1.default.find(query)
            .sort({ createdAt: -1 }) // Newest first
            .populate('relatedBookingId'); // Optional: populate booking details
        res.status(200).json(reports);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching problem reports', error });
    }
});
exports.getAllProblemReports = getAllProblemReports;
// Get Single Problem Report by ID with Notes
const getProblemReportById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const report = yield ProblemReport_1.default.findById(id).populate('relatedBookingId');
        if (!report) {
            return res.status(404).json({ message: 'Problem report not found' });
        }
        const notes = yield ProblemNote_1.default.find({ problemReportId: id }).sort({ createdAt: 1 });
        res.status(200).json({ report, notes });
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching problem report details', error });
    }
});
exports.getProblemReportById = getProblemReportById;
// Update Problem Status
const updateProblemStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, adminId } = req.body; // adminId from Auth middleware in real app
        const report = yield ProblemReport_1.default.findById(id);
        if (!report) {
            return res.status(404).json({ message: 'Problem report not found' });
        }
        const oldStatus = report.status;
        report.status = status;
        yield report.save();
        // Audit Log
        if (adminId) {
            yield AuditLog_1.default.create({
                adminId,
                action: 'UPDATE_PROBLEM_STATUS',
                targetType: 'PROBLEM_REPORT',
                targetId: id,
                metadata: { oldStatus, newStatus: status }
            });
        }
        res.status(200).json(report);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating problem status', error });
    }
});
exports.updateProblemStatus = updateProblemStatus;
// Add Internal Note
const addProblemNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { adminId, note } = req.body;
        const newNote = new ProblemNote_1.default({
            problemReportId: id,
            adminId,
            note
        });
        yield newNote.save();
        res.status(201).json(newNote);
    }
    catch (error) {
        res.status(500).json({ message: 'Error adding problem note', error });
    }
});
exports.addProblemNote = addProblemNote;
