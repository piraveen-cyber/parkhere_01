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
exports.updateRequestStatus = exports.getAllRequests = exports.getUserRequests = exports.createServiceRequest = void 0;
const ServiceRequest_1 = __importDefault(require("../models/ServiceRequest"));
const createServiceRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, bookingId, serviceType, location, notes } = req.body;
        if (!userId || !serviceType) {
            return res.status(400).json({ message: 'User ID and Service Type are required' });
        }
        const newRequest = new ServiceRequest_1.default({
            userId,
            bookingId,
            serviceType,
            location,
            notes,
            status: 'pending' // Default
        });
        const savedRequest = yield newRequest.save();
        res.status(201).json(savedRequest);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createServiceRequest = createServiceRequest;
const getUserRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const requests = yield ServiceRequest_1.default.find({ userId }).sort({ createdAt: -1 });
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getUserRequests = getUserRequests;
const getAllRequests = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Admin or Staff endpoint
        const requests = yield ServiceRequest_1.default.find().sort({ createdAt: -1 });
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllRequests = getAllRequests;
const updateRequestStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { status, price } = req.body;
        const updatedRequest = yield ServiceRequest_1.default.findByIdAndUpdate(id, { status, price }, { new: true });
        if (!updatedRequest) {
            return res.status(404).json({ message: 'Service Request not found' });
        }
        res.json(updatedRequest);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.updateRequestStatus = updateRequestStatus;
