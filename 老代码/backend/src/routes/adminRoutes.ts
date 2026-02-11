import { Router } from 'express';
import { 
  getUsers, 
  banUser, 
  approveUser,
  getStats,
  getRecordings,
  auditRecording
} from '../controllers/adminController';
import { getResetRequests, auditResetRequest } from '../controllers/authController';
import { getLogs } from '../controllers/logController';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

router.use(authenticateToken, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.put('/users/:id/ban', banUser);
router.put('/users/:id/approve', approveUser);

// 录音审核管理
router.get('/recordings', getRecordings);
router.put('/recordings/:id/audit', auditRecording);

// 密码重置申请管理
router.get('/reset-requests', getResetRequests);
router.post('/reset-requests/:id/audit', auditResetRequest);

// 系统日志
router.get('/logs', getLogs);

export default router;
