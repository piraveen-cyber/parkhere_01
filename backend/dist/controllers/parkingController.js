"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.getParkingSpotById = exports.createParkingSpot = exports.getParkingSpots = void 0;
const parkingService = __importStar(require("../services/parkingService"));
const getParkingSpots = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { search, type, startTime, endTime } = req.query;
        let start;
        let end;
        if (startTime && endTime) {
            start = new Date(startTime);
            end = new Date(endTime);
        }
        if (search || type || (start && end)) {
            const spots = yield parkingService.searchParkingSpots(search, type, start, end);
            res.json(spots);
        }
        else {
            const spots = yield parkingService.getAllParkingSpots();
            res.json(spots);
        }
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getParkingSpots = getParkingSpots;
const createParkingSpot = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const spot = yield parkingService.createParkingSpot(req.body);
        res.status(201).json(spot);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.createParkingSpot = createParkingSpot;
const getParkingSpotById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const spot = yield parkingService.getParkingSpotById(req.params.id);
        if (!spot)
            return res.status(404).json({ message: 'Spot not found' });
        res.json(spot);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getParkingSpotById = getParkingSpotById;
const getRecommendations = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lat, long, type } = req.query;
        if (!lat || !long) {
            return res.status(400).json({ message: 'Latitude and Longitude are required' });
        }
        const preference = type || 'best';
        const spots = yield parkingService.recommendSpots(parseFloat(lat), parseFloat(long), preference);
        res.json(spots);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getRecommendations = getRecommendations;
