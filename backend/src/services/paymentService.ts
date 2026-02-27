import Payment, { IPayment } from '../models/Payment';

export const processPayment = async (data: Partial<IPayment>): Promise<IPayment> => {
    // In a real app, integrate Stripe/PayPal here.
    // For now, we simulate a successful payment.

    const payment = new Payment({
        ...data,
        status: 'completed', // Auto-complete for demo
        timestamp: new Date()
    });

    return await payment.save();
};
