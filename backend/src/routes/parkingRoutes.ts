import express from 'express';
import * as parkingController from '../controllers/parkingController';

const router = express.Router();

// GET /api/parking - Get all parking spots
router.get('/', parkingController.getParkingSpots);

// POST /api/parking - Create a parking spot (for testing/seeding)
router.post('/', parkingController.createParkingSpot);

// GET /api/parking/:id - Get a single parking spot by ID
router.get('/:id', parkingController.getParkingSpotById);

export default router;
