import { Router } from 'express';
import { 
  getTopics, 
  createTopic, 
  updateTopic, 
  deleteTopic, 
  getGuideContent, 
  updateGuideContent 
} from '../controllers/contentController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

// 话题接口
router.get('/topics', getTopics); // 公开
router.post('/topics', authenticateToken, isAdmin, createTopic);
router.put('/topics/:id', authenticateToken, isAdmin, updateTopic);
router.delete('/topics/:id', authenticateToken, isAdmin, deleteTopic);

// 引导内容接口
router.get('/guide', getGuideContent); // 公开
router.post('/guide', authenticateToken, isAdmin, updateGuideContent);

export default router;
