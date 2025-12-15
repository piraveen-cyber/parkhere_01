"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const authAdmin_1 = require("../middleware/authAdmin");
const loginLimiter_1 = require("../middleware/loginLimiter");
const superAdminController_1 = require("../controllers/superAdminController");
const router = express_1.default.Router();
// Auth Routes
router.post('/auth/login', loginLimiter_1.loginLimiter, adminController_1.loginAdmin); // Protected by rate limiter
router.post('/auth/register', adminController_1.registerAdmin);
router.get('/auth/me', authAdmin_1.protectAdmin, adminController_1.getMe);
// Management Routes (Protected + Super Admin Only) -> Add superAdminOnly middleware later if needed
router.get('/partners', authAdmin_1.protectAdmin, superAdminController_1.getAllPartners);
router.put('/partners/:id/kyc', authAdmin_1.protectAdmin, superAdminController_1.updatePartnerKYC);
router.put('/services/:id', authAdmin_1.protectAdmin, superAdminController_1.updateService);
router.get('/config', authAdmin_1.protectAdmin, superAdminController_1.getSystemConfig);
router.put('/config/:key', authAdmin_1.protectAdmin, superAdminController_1.updateSystemConfig);
router.get('/stats', authAdmin_1.protectAdmin, superAdminController_1.getDashboardStats);
exports.default = router;
