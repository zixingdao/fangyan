import { Router } from 'express';
import { requestPasswordReset, updateProfile, getProfile } from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/password-reset-request', requestPasswordReset);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

export default router;
