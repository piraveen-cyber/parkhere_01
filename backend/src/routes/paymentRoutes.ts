import express from 'express';
import * as paymentController from '../controllers/paymentController';

const router = express.Router();

router.post('/create-payment-intent', paymentController.createPaymentIntent);
router.post('/', paymentController.processPayment); // Process generic/simulated payment

export default router;
