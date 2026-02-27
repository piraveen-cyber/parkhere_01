import express from 'express';
import * as adminController from '../controllers/adminController';

const router = express.Router();

// Get System Stats
router.get('/stats', adminController.getStats);

// Get All Bookings
router.get('/bookings', adminController.getAllBookings);

// Get All Users
router.get('/users', adminController.getAllUsers);

export default router;
