import express from 'express';
import { loginAdmin, registerAdmin, getMe } from '../controllers/adminController';
import { protectAdmin } from '../middleware/authAdmin';
import { loginLimiter } from '../middleware/loginLimiter';
import { getAllPartners, updatePartnerKYC, getAllServices, updateService, getDashboardStats, getSystemConfig, updateSystemConfig } from '../controllers/superAdminController';


const router = express.Router();

// Auth Routes
router.post('/auth/login', loginLimiter, loginAdmin); // Protected by rate limiter
router.post('/auth/register', registerAdmin);
router.get('/auth/me', protectAdmin, getMe);

// Management Routes (Protected + Super Admin Only) -> Add superAdminOnly middleware later if needed
router.get('/partners', protectAdmin, getAllPartners);
router.put('/partners/:id/kyc', protectAdmin, updatePartnerKYC);

router.put('/services/:id', protectAdmin, updateService);

router.get('/config', protectAdmin, getSystemConfig);
router.put('/config/:key', protectAdmin, updateSystemConfig);

router.get('/stats', protectAdmin, getDashboardStats);

export default router;
