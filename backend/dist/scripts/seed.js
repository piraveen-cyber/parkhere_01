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
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const ParkingSpot_1 = __importDefault(require("../models/ParkingSpot"));
dotenv_1.default.config();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/parkhere';
const parkingSpots = [
    {
        name: 'Colombo City Centre Car Park',
        latitude: 6.9197,
        longitude: 79.8603,
        type: 'car',
        pricePerHour: 200,
        isAvailable: true,
        address: '137 Sir James Pieris Mawatha, Colombo 00200',
        description: 'Secure indoor parking with 24/7 surveillance.'
    },
    {
        name: 'Majestic City Parking',
        latitude: 6.8940,
        longitude: 79.8548,
        type: 'car',
        pricePerHour: 150,
        isAvailable: true,
        address: '10 Station Rd, Colombo 00400',
        description: 'Underground parking for shoppers.'
    },
    {
        name: 'Galle Face Green Parking',
        latitude: 6.9271,
        longitude: 79.8453,
        type: 'car',
        pricePerHour: 100,
        isAvailable: true,
        address: 'Galle Face Dr, Colombo 00300',
        description: 'Open air parking near the beach.'
    },
    {
        name: 'Liberty Plaza Parking',
        latitude: 6.9118,
        longitude: 79.8524,
        type: 'car',
        pricePerHour: 180,
        isAvailable: false,
        address: '250 R. A. De Mel Mawatha, Colombo 00300',
        description: 'Multi-level parking facility.'
    },
    {
        name: 'Pettah Main Street Bike Park',
        latitude: 6.9366,
        longitude: 79.8488,
        type: 'bike',
        pricePerHour: 50,
        isAvailable: true,
        address: 'Main Street, Pettah',
        description: 'Designated area for motorbikes.'
    }
];
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose_1.default.connect(MONGODB_URI);
        console.log('Connected to MongoDB');
        // Clear existing data
        yield ParkingSpot_1.default.deleteMany({});
        console.log('Cleared existing parking spots');
        // Insert new data
        yield ParkingSpot_1.default.insertMany(parkingSpots);
        console.log('Seeded parking spots successfully');
        mongoose_1.default.connection.close();
    }
    catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
});
seedDB();
