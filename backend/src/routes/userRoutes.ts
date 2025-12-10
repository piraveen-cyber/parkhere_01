import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.post('/', userController.updateUser);
router.get('/:id', userController.getUser);

export default router;
