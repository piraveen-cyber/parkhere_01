import express from 'express';
import {
    createProblemReport,
    getAllProblemReports,
    getProblemReportById,
    updateProblemStatus,
    addProblemNote
} from '../controllers/problemController';
import { protectAdmin } from '../middleware/authAdmin';

const router = express.Router();

// Public / User Routes
router.post('/', createProblemReport); // Create Report

// Admin Routes (Protected)
router.get('/', protectAdmin, getAllProblemReports); // List Reports
router.get('/:id', protectAdmin, getProblemReportById); // Get Detail
router.patch('/:id/status', protectAdmin, updateProblemStatus); // Update Status
router.post('/:id/notes', protectAdmin, addProblemNote); // Add Internal Note

export default router;
