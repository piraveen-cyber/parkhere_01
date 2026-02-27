import express from 'express';
import * as bookingController from '../controllers/bookingController';
import validate from '../middleware/validateResource';
import { createBookingSchema } from '../schema/booking.schema';

const router = express.Router();

// POST /api/bookings - Create a booking
router.post('/', validate(createBookingSchema), bookingController.createBooking);

// GET /api/bookings/:userId - Get bookings for a user
router.get('/:userId', bookingController.getUserBookings);

// POST /api/bookings/scan - QR Scan for Check-In/Out
router.post('/scan', bookingController.scanBooking);

// POST /api/bookings/:bookingId/extend - Extend Booking Time
router.post('/:bookingId/extend', bookingController.extendBooking);

export default router;
