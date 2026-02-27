"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookingSchema = void 0;
const zod_1 = require("zod");
exports.createBookingSchema = (0, zod_1.object)({
    body: (0, zod_1.object)({
        userId: (0, zod_1.string)(),
        parkingSpotId: (0, zod_1.string)(),
        startTime: (0, zod_1.string)().datetime(),
        endTime: (0, zod_1.string)().datetime(),
        totalPrice: (0, zod_1.number)(),
    }),
});
