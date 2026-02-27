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
exports.scanBooking = exports.getUserBookings = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking")); // Direct model access for now, or use service
const bookingService = __importStar(require("../services/bookingService"));
const createBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, parkingSpotId, startTime, endTime, totalPrice } = req.body;
        const start = new Date(startTime);
        const end = new Date(endTime);
        // Check for overlap
        // Overlap condition: (StartA < EndB) and (EndA > StartB)
        const overlappingBooking = yield Booking_1.default.findOne({
            parkingSpotId,
            status: { $in: ['active', 'pending'] },
            $or: [
                {
                    startTime: { $lt: end },
                    endTime: { $gt: start }
                }
            ]
        });
        if (overlappingBooking) {
            return res.status(409).json({ message: 'Parking spot is not available for the selected time period.' });
        }
        const savedBooking = yield bookingService.createBooking({
            userId,
            parkingSpotId,
            startTime: start,
            endTime: end,
            totalPrice,
            status: 'active', // Auto-activate for now, assuming payment success handled on frontend
            paymentStatus: 'paid'
        });
        res.status(201).json(savedBooking);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating booking', error });
    }
});
exports.createBooking = createBooking;
const getUserBookings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const bookings = yield bookingService.getBookingsByUser(req.params.userId);
        res.json(bookings);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
});
exports.getUserBookings = getUserBookings;
const scanBooking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }
        const booking = yield Booking_1.default.findById(bookingId);
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        // Logic:
        // 1. If Active/Paid AND Not Checked In -> Check In
        // 2. If Active/Paid AND Checked In -> Check Out and Calculate Fee
        // Check In (Logic 1)
        if (!booking.actualCheckInTime) {
            if (booking.status === 'completed' || booking.status === 'cancelled') {
                return res.status(400).json({ message: 'Booking is invalid for check-in' });
            }
            booking.actualCheckInTime = new Date();
            yield booking.save();
            return res.json({ message: 'Check-in successful', type: 'check-in', booking });
        }
        // Check Out (Logic 2)
        if (booking.actualCheckInTime && !booking.actualCheckOutTime) {
            const checkOutTime = new Date();
            booking.actualCheckOutTime = checkOutTime;
            // Calculate Overstay
            let extraFee = 0;
            const endTime = new Date(booking.endTime);
            // If checked out after booked end time + grace period (e.g. 15 mins)
            const gracePeriodMs = 15 * 60 * 1000;
            if (checkOutTime.getTime() > (endTime.getTime() + gracePeriodMs)) {
                // Determine overstay duration in hours (ceil)
                const overstayMs = checkOutTime.getTime() - endTime.getTime();
                const overstayHours = Math.ceil(overstayMs / (1000 * 60 * 60));
                // Assume strict rate of $10/hour for penalty or fetching spot rate (simplified here)
                const penaltyRate = 10;
                extraFee = overstayHours * penaltyRate;
                booking.extraFee = extraFee;
                // Since user wants "Auto Deduct", we simulate it here.
                // In real world: await stripe.chargeSavedCard(...)
                booking.paymentStatus = 'paid'; // Marking extra fee as paid (simulated auto-deduct)
            }
            booking.status = 'completed';
            yield booking.save();
            const message = extraFee > 0
                ? `Check-out successful. Overstay fee of $${extraFee} has been auto-deducted.`
                : 'Check-out successful';
            return res.json({ message, type: 'check-out', extraFee, booking });
        }
        // Already Checked Out
        if (booking.actualCheckOutTime) {
            return res.status(400).json({ message: 'Booking already checked out' });
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.scanBooking = scanBooking;
