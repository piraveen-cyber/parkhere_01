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
exports.extendBooking = exports.processScan = exports.getBookingsByUser = exports.createBooking = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const ParkingSpot_1 = __importDefault(require("../models/ParkingSpot"));
const mongoose_1 = __importDefault(require("mongoose"));
const createBooking = (bookingData) => __awaiter(void 0, void 0, void 0, function* () {
    // 1. Resolve Spot ID if it's a name
    let { parkingSpotId } = bookingData;
    if (!mongoose_1.default.Types.ObjectId.isValid(parkingSpotId)) {
        let spot = yield ParkingSpot_1.default.findOne({ name: parkingSpotId });
        if (!spot) {
            // Mock spot creation for demo flow if not found
            spot = yield ParkingSpot_1.default.create({
                name: parkingSpotId,
                latitude: 6.9271,
                longitude: 79.8612,
                pricePerHour: 200,
                type: 'car',
                floor: 1,
                block: 'A'
            });
        }
        bookingData.parkingSpotId = spot._id;
    }
    // 2. Overlap Check
    const start = new Date(bookingData.startTime);
    const end = new Date(bookingData.endTime);
    const overlappingBooking = yield Booking_1.default.findOne({
        parkingSpotId: bookingData.parkingSpotId,
        status: { $in: ['active', 'pending'] },
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
    });
    if (overlappingBooking) {
        throw new Error('Parking spot is not available for the selected time period.');
    }
    const newBooking = new Booking_1.default(Object.assign(Object.assign({}, bookingData), { startTime: start, endTime: end, status: 'pending', paymentStatus: 'paid' }));
    return yield newBooking.save();
});
exports.createBooking = createBooking;
const getBookingsByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Booking_1.default.find({ userId }).populate('parkingSpotId');
});
exports.getBookingsByUser = getBookingsByUser;
const processScan = (bookingId) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield Booking_1.default.findById(bookingId);
    if (!booking)
        throw new Error('Booking not found');
    // Check In
    if (!booking.actualCheckInTime) {
        if (booking.status === 'completed' || booking.status === 'cancelled') {
            throw new Error('Booking is invalid for check-in');
        }
        booking.actualCheckInTime = new Date();
        booking.status = 'active'; // Ensure status is active on check-in
        yield booking.save();
        return { message: 'Check-in successful', type: 'check-in', booking };
    }
    // Check Out
    if (booking.actualCheckInTime && !booking.actualCheckOutTime) {
        const checkOutTime = new Date();
        booking.actualCheckOutTime = checkOutTime;
        let extraFee = 0;
        const endTime = new Date(booking.endTime);
        const gracePeriodMs = 15 * 60 * 1000;
        if (checkOutTime.getTime() > (endTime.getTime() + gracePeriodMs)) {
            const overstayMs = checkOutTime.getTime() - endTime.getTime();
            const overstayHours = Math.ceil(overstayMs / (1000 * 60 * 60));
            const penaltyRate = 10;
            extraFee = overstayHours * penaltyRate;
            booking.extraFee = extraFee;
            booking.paymentStatus = 'paid'; // Simulated auto-deduct
        }
        booking.status = 'completed';
        yield booking.save();
        const message = extraFee > 0
            ? `Check-out successful. Overstay fee of $${extraFee} has been auto-deducted.`
            : 'Check-out successful';
        return { message, type: 'check-out', extraFee, booking };
    }
    if (booking.actualCheckOutTime) {
        throw new Error('Booking already checked out');
    }
});
exports.processScan = processScan;
const extendBooking = (bookingId, extraHours) => __awaiter(void 0, void 0, void 0, function* () {
    const booking = yield Booking_1.default.findById(bookingId);
    if (!booking)
        throw new Error('Booking not found');
    // Allow extension if active or pending (before check-in?) - assuming active for now as per controller
    if (booking.status !== 'active' && booking.status !== 'pending') {
        throw new Error('Only active or pending bookings can be extended');
    }
    const currentEndTime = new Date(booking.endTime);
    const addedMillis = extraHours * 60 * 60 * 1000;
    const newEndTime = new Date(currentEndTime.getTime() + addedMillis);
    booking.endTime = newEndTime;
    const ratePerHour = 200;
    const additionalCost = extraHours * ratePerHour;
    booking.totalPrice += additionalCost;
    yield booking.save();
    return { message: 'Booking extended successfully', booking, additionalCost };
});
exports.extendBooking = extendBooking;
