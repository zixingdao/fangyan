import { Router } from 'express';
import { register, login, requestPasswordReset } from '../controllers/authController';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/reset-request', requestPasswordReset);

export default router;
