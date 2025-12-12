import express from 'express';
import * as serviceController from '../controllers/serviceController';

const router = express.Router();

// POST /api/services - Request a service
// Body: { userId, serviceType, bookingId?, location?, notes? }
router.post('/', serviceController.createServiceRequest);

// GET /api/services/user/:userId - Get User's requests
router.get('/user/:userId', serviceController.getUserRequests);

// GET /api/services/all - Get All requests (Staff/Admin)
router.get('/all', serviceController.getAllRequests);

// PATCH /api/services/:id - Update status (e.g. assigned, completed)
router.patch('/:id', serviceController.updateRequestStatus);

export default router;
