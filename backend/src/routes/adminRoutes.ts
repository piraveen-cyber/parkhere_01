import express from 'express';
import * as adminController from '../controllers/adminController';
import { verifyToken, verifyAdmin } from '../middleware/authMiddleware';

const router = express.Router();

// Apply middleware to all routes in this router
router.use(verifyToken, verifyAdmin);

// Get System Stats
router.get('/stats', adminController.getStats);

// Get All Bookings
router.get('/bookings', adminController.getAllBookings);

// Get All Users
router.get('/users', adminController.getAllUsers);

export default router;
