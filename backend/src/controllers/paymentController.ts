import { Request, Response } from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
} as any);

export const createPaymentIntent = async (req: Request, res: Response) => {
    try {
        const { amount, currency = 'usd' } = req.body;

        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const processPayment = async (req: Request, res: Response) => {
    try {
        const { userId, amount, method, bookingId } = req.body;

        // Simulate processing Logic
        // In a real app, this would verify the payment with the gateway
        // or record the cash transaction.

        console.log(`Processing Payment: User ${userId}, Amount ${amount}, Method ${method}`); // Log it

        // Return a mock success response
        res.json({
            success: true,
            message: 'Payment processed successfully',
            transactionId: 'TXN_' + Math.floor(Math.random() * 10000000)
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
