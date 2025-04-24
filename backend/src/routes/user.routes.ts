import { Router } from 'express';
import { getProfile, updateProfile, updatePassword } from '@/controllers/user.controller';
import { authMiddleware } from '@/middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/password', updatePassword);

export default router; 