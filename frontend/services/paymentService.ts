import api from './api';

export interface PaymentData {
    userId: string;
    amount: number;
    method: string;
    bookingId?: string;
}

export const processPayment = async (data: PaymentData) => {
    const response = await api.post('/payments', data);
    return response.data;
};
