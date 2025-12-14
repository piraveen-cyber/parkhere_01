import express from 'express';
import * as paymentController from '../controllers/paymentController';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-payment-intent', verifyToken, paymentController.createPaymentIntent);
router.post('/', verifyToken, paymentController.processPayment); // Process generic/simulated payment

export default router;
