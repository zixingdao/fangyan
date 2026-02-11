import { Router } from 'express';
import authRoutes from './authRoutes';
import adminRoutes from './adminRoutes';
import rankingRoutes from './rankingRoutes';
import userRoutes from './userRoutes';
import systemRoutes from './systemRoutes';
import jobRoutes from './jobRoutes';
import contentRoutes from './contentRoutes';
import uploadRoutes from './uploadRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/admin', adminRoutes);
router.use('/rankings', rankingRoutes);
router.use('/users', userRoutes);
router.use('/system', systemRoutes);
router.use('/jobs', jobRoutes);
router.use('/content', contentRoutes);
router.use('/upload', uploadRoutes);

export default router;
