import { Router } from 'express';
import { rankingService } from '../services/rankingService';
import { authenticateToken, isAdmin } from '../middleware/auth';
import logger from '../utils/logger';

const router = Router();

// 手动触发榜单刷新 (管理员)
router.post('/refresh', authenticateToken, isAdmin, async (req, res) => {
  try {
    await rankingService.refreshAllRankings();
    res.json({ message: '榜单刷新任务已触发' });
  } catch (error) {
    logger.error('榜单刷新失败:', error);
    res.status(500).json({ message: '刷新失败' });
  }
});

export default router;
