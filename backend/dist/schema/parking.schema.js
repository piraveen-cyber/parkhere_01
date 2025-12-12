"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createParkingSchema = void 0;
const zod_1 = require("zod");
exports.createParkingSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        ownerId: (0, zod_1.string)(),
        name: (0, zod_1.string)(),
        description: (0, zod_1.string)().optional(),
        address: (0, zod_1.string)(),
        latitude: (0, zod_1.number)(),
        longitude: (0, zod_1.number)(),
        pricePerHour: (0, zod_1.number)(),
        images: (0, zod_1.array)((0, zod_1.string)()).optional(),
        facilities: (0, zod_1.array)((0, zod_1.string)()).optional(),
        isAvailable: (0, zod_1.boolean)().optional().default(true)
    })
});
