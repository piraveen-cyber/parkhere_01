import { object, string, number, array, TypeOf, boolean } from 'zod';

export const createParkingSchema = object({
    body: object({
        ownerId: string(),
        name: string(),
        description: string().optional(),
        address: string(),
        latitude: number(),
        longitude: number(),
        pricePerHour: number(),
        images: array(string()).optional(),
        facilities: array(string()).optional(),
        isAvailable: boolean().optional().default(true)
    })
});

export type CreateParkingInput = TypeOf<typeof createParkingSchema>;
