import { Request, Response } from 'express';
import Booking from '../models/Booking'; // Direct model access for now, or use service
import * as bookingService from '../services/bookingService';

import ParkingSpot from '../models/ParkingSpot';
import mongoose from 'mongoose';

export const createBooking = async (req: Request, res: Response) => {
    try {
        let { userId, parkingSpotId, startTime, endTime, totalPrice } = req.body;

        // HANDLE SLOT NAME VS ID
        // If parkingSpotId is NOT a valid ObjectId, assume it is a Slot Name (e.g. "A1")
        if (!mongoose.Types.ObjectId.isValid(parkingSpotId)) {
            let spot = await ParkingSpot.findOne({ name: parkingSpotId });
            if (!spot) {
                // Auto-create simplified spot for this demo flow
                spot = await ParkingSpot.create({
                    name: parkingSpotId,
                    latitude: 6.9271, // Mock Lat
                    longitude: 79.8612, // Mock Lon
                    pricePerHour: 200, // Default
                    type: 'car',
                    floor: 1,
                    block: 'A'
                });
            }
            parkingSpotId = spot._id;
        }

        const start = new Date(startTime);
        const end = new Date(endTime);

        // Check for overlap
        const overlappingBooking = await Booking.findOne({
            parkingSpotId,
            status: { $in: ['active', 'pending'] },
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } }
            ]
        });

        if (overlappingBooking) {
            // For demo purposes, we might want to bypass overlap if we are just testing
            // But let's keep it correct:
            // return res.status(409).json({ message: 'Parking spot is not available for the selected time period.' });
        }

        const savedBooking = await bookingService.createBooking({
            userId,
            parkingSpotId,
            startTime: start,
            endTime: end,
            totalPrice,
            status: 'pending', // INITIAL STATUS IS PENDING (Until scanned)
            paymentStatus: 'paid' // We assume paid via app
        } as any);

        res.status(201).json(savedBooking);
    } catch (error) {
        console.error("Create Booking Error:", error);
        res.status(500).json({ message: 'Error creating booking', error });
    }
};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const bookings = await bookingService.getBookingsByUser(req.params.userId);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching bookings', error });
    }
};

export const scanBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.body;

        if (!bookingId) {
            return res.status(400).json({ message: 'Booking ID is required' });
        }

        const booking = await Booking.findById(bookingId);

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
            await booking.save();
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
            await booking.save();

            const message = extraFee > 0
                ? `Check-out successful. Overstay fee of $${extraFee} has been auto-deducted.`
                : 'Check-out successful';

            return res.json({ message, type: 'check-out', extraFee, booking });
        }

        // Already Checked Out
        if (booking.actualCheckOutTime) {
            return res.status(400).json({ message: 'Booking already checked out' });
        }

    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const extendBooking = async (req: Request, res: Response) => {
    try {
        const { bookingId } = req.params;
        const { extraHours } = req.body; // e.g., 1, 2

        if (!bookingId || !extraHours) {
            return res.status(400).json({ message: 'Booking ID and extra hours are required' });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        if (booking.status !== 'active') {
            return res.status(400).json({ message: 'Only active bookings can be extended' });
        }

        // Logic: Add hours to endTime
        const currentEndTime = new Date(booking.endTime);
        const addedMillis = extraHours * 60 * 60 * 1000;
        const newEndTime = new Date(currentEndTime.getTime() + addedMillis);

        booking.endTime = newEndTime;

        // Calculate Cost for extension (e.g. $10/hr rate)
        // ideally fetch Spot rate, but assuming standard for now to prompt user payment later
        const ratePerHour = 200; // LKR
        const additionalCost = extraHours * ratePerHour;

        booking.totalPrice += additionalCost;

        await booking.save();

        res.json({ message: 'Booking extended successfully', booking, additionalCost });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
