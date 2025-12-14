import Booking, { IBooking } from '../models/Booking';
import ParkingSpot from '../models/ParkingSpot';
import mongoose from 'mongoose';

export const createBooking = async (bookingData: any): Promise<IBooking> => {
    // 1. Resolve Spot ID if it's a name
    let { parkingSpotId } = bookingData;
    if (!mongoose.Types.ObjectId.isValid(parkingSpotId)) {
        let spot = await ParkingSpot.findOne({ name: parkingSpotId });
        if (!spot) {
            // Mock spot creation for demo flow if not found
            spot = await ParkingSpot.create({
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

    const overlappingBooking = await Booking.findOne({
        parkingSpotId: bookingData.parkingSpotId,
        status: { $in: ['active', 'pending'] },
        $or: [
            { startTime: { $lt: end }, endTime: { $gt: start } }
        ]
    });

    if (overlappingBooking) {
        throw new Error('Parking spot is not available for the selected time period.');
    }

    const newBooking = new Booking({
        ...bookingData,
        startTime: start,
        endTime: end,
        status: 'pending',
        paymentStatus: 'paid'
    });
    return await newBooking.save();
};

export const getBookingsByUser = async (userId: string): Promise<IBooking[]> => {
    return await Booking.find({ userId }).populate('parkingSpotId');
};

export const processScan = async (bookingId: string) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

    // Check In
    if (!booking.actualCheckInTime) {
        if (booking.status === 'completed' || booking.status === 'cancelled') {
            throw new Error('Booking is invalid for check-in');
        }
        booking.actualCheckInTime = new Date();
        booking.status = 'active'; // Ensure status is active on check-in
        await booking.save();
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
        await booking.save();

        const message = extraFee > 0
            ? `Check-out successful. Overstay fee of $${extraFee} has been auto-deducted.`
            : 'Check-out successful';

        return { message, type: 'check-out', extraFee, booking };
    }

    if (booking.actualCheckOutTime) {
        throw new Error('Booking already checked out');
    }
};

export const extendBooking = async (bookingId: string, extraHours: number) => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error('Booking not found');

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

    await booking.save();
    return { message: 'Booking extended successfully', booking, additionalCost };
};
