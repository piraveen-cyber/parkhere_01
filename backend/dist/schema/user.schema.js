"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
exports.createUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        supabaseId: (0, zod_1.string)(),
        name: (0, zod_1.string)(),
        email: (0, zod_1.string)().email('Not a valid email'),
        phone: (0, zod_1.string)().optional(),
        gender: (0, zod_1.string)().optional(),
        vehiclePlate: (0, zod_1.string)().optional(),
    }),
});
exports.updateUserSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        name: (0, zod_1.string)().optional(),
        email: (0, zod_1.string)().email('Not a valid email').optional(),
        phone: (0, zod_1.string)().optional(),
        gender: (0, zod_1.string)().optional(),
        vehiclePlate: (0, zod_1.string)().optional(),
    }),
});
