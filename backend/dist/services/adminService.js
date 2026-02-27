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
exports.getAllUsers = exports.getAllBookings = exports.getSystemStats = void 0;
const Booking_1 = __importDefault(require("../models/Booking"));
const User_1 = __importDefault(require("../models/User"));
const ParkingSpot_1 = __importDefault(require("../models/ParkingSpot"));
const getSystemStats = () => __awaiter(void 0, void 0, void 0, function* () {
    const totalUsers = yield User_1.default.countDocuments();
    const totalBookings = yield Booking_1.default.countDocuments();
    const totalParkingSpots = yield ParkingSpot_1.default.countDocuments();
    const revenueResult = yield Booking_1.default.aggregate([
        { $match: { status: { $in: ['active', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;
    return {
        totalUsers,
        totalBookings,
        totalParkingSpots,
        totalRevenue
    };
});
exports.getSystemStats = getSystemStats;
const getAllBookings = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield Booking_1.default.find().populate('parkingSpotId');
});
exports.getAllBookings = getAllBookings;
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield User_1.default.find();
});
exports.getAllUsers = getAllUsers;
