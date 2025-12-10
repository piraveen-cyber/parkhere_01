import express from 'express';
import * as bookingController from '../controllers/bookingController';

const router = express.Router();

// POST /api/bookings - Create a booking
router.post('/', bookingController.createBooking);

// GET /api/bookings/:userId - Get bookings for a user
router.get('/:userId', bookingController.getUserBookings);

export default router;
