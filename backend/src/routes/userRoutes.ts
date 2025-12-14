import express from 'express';
import * as userController from '../controllers/userController';
import * as verificationController from '../controllers/verificationController';
import validate from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';
import { verifyToken } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', verifyToken, validate(createUserSchema), userController.updateUser);
router.get('/:id', userController.getUser);

// Verification Endpoints
router.post('/verify-disability', verifyToken, verificationController.requestDisabilityVerification);
router.post('/approve-disability', verifyToken, verificationController.approveDisabilityVerification);

export default router;
