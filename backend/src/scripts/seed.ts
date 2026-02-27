import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ParkingSpot from '../models/ParkingSpot';

dotenv.config();

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

const seedDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await ParkingSpot.deleteMany({});
        console.log('Cleared existing parking spots');

        // Insert new data
        await ParkingSpot.insertMany(parkingSpots);
        console.log('Seeded parking spots successfully');

        mongoose.connection.close();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDB();
