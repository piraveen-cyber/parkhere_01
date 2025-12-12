import { object, string, number, TypeOf } from 'zod';

export const createBookingSchema = object({
    body: object({
        userId: string(),
        parkingSpotId: string(),
        startTime: string().datetime(),
        endTime: string().datetime(),
        totalPrice: number(),
    }),
});

export type CreateBookingInput = TypeOf<typeof createBookingSchema>;
