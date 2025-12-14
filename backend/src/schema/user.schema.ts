import { object, string, TypeOf } from 'zod';

export const createUserSchema = object({
    body: object({
        supabaseId: string(),
        name: string(),
        email: string().email('Not a valid email'),
        phone: string().optional(),
        gender: string().optional(),
        vehiclePlate: string().optional(),
        vehicleModel: string().optional(),
        vehicleType: string().optional(),
        vehicleBrand: string().optional(),
        fuelType: string().optional(),
        transmission: string().optional(),
        avatarUrl: string().optional(),
    }),
});

export const updateUserSchema = object({
    body: object({
        name: string().optional(),
        email: string().email('Not a valid email').optional(),
        phone: string().optional(),
        gender: string().optional(),
        vehiclePlate: string().optional(),
        vehicleModel: string().optional(),
        vehicleType: string().optional(),
        vehicleBrand: string().optional(),
        fuelType: string().optional(),
        transmission: string().optional(),
        avatarUrl: string().optional(),
    }),
});

export type CreateUserInput = TypeOf<typeof createUserSchema>;
export type UpdateUserInput = TypeOf<typeof updateUserSchema>;
