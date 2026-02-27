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
exports.recommendSpots = exports.searchParkingSpots = exports.getParkingSpotById = exports.createParkingSpot = exports.getAllParkingSpots = void 0;
const ParkingSpot_1 = __importDefault(require("../models/ParkingSpot"));
const Booking_1 = __importDefault(require("../models/Booking"));
const getAllParkingSpots = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield ParkingSpot_1.default.find();
});
exports.getAllParkingSpots = getAllParkingSpots;
const createParkingSpot = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const spot = new ParkingSpot_1.default(data);
    return yield spot.save();
});
exports.createParkingSpot = createParkingSpot;
const getParkingSpotById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield ParkingSpot_1.default.findById(id);
});
exports.getParkingSpotById = getParkingSpotById;
const searchParkingSpots = (query, type, startTime, endTime) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = {};
    if (type && type !== 'all') {
        filter.type = type;
    }
    if (query) {
        filter.$or = [
            { name: { $regex: query, $options: 'i' } },
            { address: { $regex: query, $options: 'i' } }
        ];
    }
    if (startTime && endTime) {
        const bookedSpotIds = yield Booking_1.default.find({
            status: { $in: ['active', 'pending'] },
            $or: [
                { startTime: { $lt: endTime }, endTime: { $gt: startTime } }
            ]
        }).distinct('parkingSpotId');
        filter._id = { $nin: bookedSpotIds };
    }
    return yield ParkingSpot_1.default.find(filter);
});
exports.searchParkingSpots = searchParkingSpots;
// Recommendation Logic
const recommendSpots = (lat, long, preference) => __awaiter(void 0, void 0, void 0, function* () {
    // Get all spots (or filter by radius first if DB supports it, here we fetch all and sort in memory for simplicity)
    const allSpots = yield ParkingSpot_1.default.find();
    // Check availability for "best" calculation (simplified: assume "now")
    // For a real app, we'd check active bookings overlaps.
    // Let's assume we want available spots right now.
    const now = new Date();
    const activeBookings = yield Booking_1.default.find({
        status: { $in: ['active', 'pending'] },
        endTime: { $gt: now },
        startTime: { $lt: now }
    }).distinct('parkingSpotId');
    // Map to simple objects with distance
    const candidates = allSpots.map(spot => {
        const isOccupied = activeBookings.some(id => id.toString() === spot._id.toString());
        const distance = Math.sqrt(Math.pow(spot.latitude - lat, 2) + Math.pow(spot.longitude - long, 2)); // Euclidean simple
        return Object.assign(Object.assign({}, spot.toObject()), { distance, isOccupied });
    });
    let results = candidates.filter(s => !s.isOccupied); // Prefer available
    // If no available, fallback to occupied (waiting time logic could apply here)
    if (results.length === 0)
        results = candidates;
    if (preference === 'cheapest') {
        results.sort((a, b) => a.pricePerHour - b.pricePerHour);
    }
    else if (preference === 'nearest') {
        results.sort((a, b) => a.distance - b.distance);
    }
    else {
        // "Best": Balance distance and price. Weighted score.
        // Lower score is better.
        // Score = (Price * 0.7) + (Distance * 100 * 0.3) -> Normalization needed really.
        // Heuristic: Price is king?
        results.sort((a, b) => (a.pricePerHour + a.distance * 10) - (b.pricePerHour + b.distance * 10));
    }
    return results;
});
exports.recommendSpots = recommendSpots;
