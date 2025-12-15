import express from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { protectAdmin } from '../middleware/authAdmin';

const router = express.Router();

// Protected Admin Routes
router.get('/', protectAdmin, getAuditLogs);

export default router;
