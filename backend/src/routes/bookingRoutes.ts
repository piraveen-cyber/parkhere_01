import express from 'express';
import * as bookingController from '../controllers/bookingController';
import validate from '../middleware/validateResource';
import { createBookingSchema } from '../schema/booking.schema';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

// POST /api/bookings - Create a booking
router.post('/', verifyToken, validate(createBookingSchema), bookingController.createBooking);

// GET /api/bookings/:userId - Get bookings for a user
router.get('/:userId', verifyToken, bookingController.getUserBookings);

// POST /api/bookings/scan - QR Scan for Check-In/Out
router.post('/scan', verifyToken, bookingController.scanBooking);

// POST /api/bookings/:bookingId/extend - Extend Booking Time
router.post('/:bookingId/extend', verifyToken, bookingController.extendBooking);

export default router;
