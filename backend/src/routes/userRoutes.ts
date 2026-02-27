import express from 'express';
import * as userController from '../controllers/userController';
import * as verificationController from '../controllers/verificationController';
import validate from '../middleware/validateResource';
import { createUserSchema } from '../schema/user.schema';

const router = express.Router();

router.post('/', validate(createUserSchema), userController.updateUser);
router.get('/:id', userController.getUser);

// Verification Endpoints
router.post('/verify-disability', verificationController.requestDisabilityVerification);
router.post('/approve-disability', verificationController.approveDisabilityVerification);

export default router;
