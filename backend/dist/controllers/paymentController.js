"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2023-10-16',
});
const createPaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount, currency = 'usd' } = req.body;
        if (!amount) {
            return res.status(400).json({ message: 'Amount is required' });
        }
        const paymentIntent = yield stripe.paymentIntents.create({
            amount,
            currency,
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createPaymentIntent = createPaymentIntent;
const processPayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.processPayment = processPayment;
