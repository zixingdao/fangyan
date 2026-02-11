import { Request, Response } from 'express';
import { Ranking, User } from '../models';
import logger from '../utils/logger';

export const getRankings = async (req: Request, res: Response) => {
  try {
    const type = (req.query.type as string) || 'total';
    
    // 这里应该是复杂的查询逻辑，这里先简化返回
    // 实际应该根据 type 过滤日期
    const rankings = await Ranking.findAll({
      where: { rank_type: type },
      include: [{ model: User, as: 'user', attributes: ['name', 'student_id', 'school'] }],
      order: [['rank_number', 'ASC']],
      limit: 50
    });

    res.json(rankings);
  } catch (error) {
    logger.error('获取榜单失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

export const getMyRanking = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: '未登录' });
    }

    const myRanking = await Ranking.findOne({
      where: { user_id: userId, rank_type: 'total' }, // 默认返回总榜
      include: [{ model: User, as: 'user', attributes: ['name'] }]
    });

    res.json(myRanking || { message: '暂无排名' });
  } catch (error) {
    logger.error('获取个人排名失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
