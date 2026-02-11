import { Router } from 'express';
import { getRankings, getMyRanking } from '../controllers/rankingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/', getRankings);
router.get('/my', authenticateToken, getMyRanking);

export default router;
