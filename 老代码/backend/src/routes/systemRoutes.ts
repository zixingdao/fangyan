import { Router } from 'express';
import { getSystemConfig, getAllConfigs, updateSystemConfig } from '../controllers/systemController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// 公共/用户接口
router.get('/:key', authenticateToken, getSystemConfig);

// 管理员接口
router.get('/', authenticateToken, isAdmin, getAllConfigs);
router.post('/', authenticateToken, isAdmin, updateSystemConfig);

export default router;
