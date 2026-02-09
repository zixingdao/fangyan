import { Request, Response } from 'express';
import { SystemLog, User } from '../models';
import { Op } from 'sequelize';
import logger from '../utils/logger';

export const getLogs = async (req: Request, res: Response) => {
  try {
    const { type, startDate, endDate, keyword } = req.query;
    const whereClause: any = {};

    if (type && type !== 'all') {
      whereClause.type = type;
    }

    if (startDate && endDate) {
      whereClause.created_at = {
        [Op.between]: [new Date(startDate as string), new Date(endDate as string)]
      };
    }

    if (keyword) {
      whereClause[Op.or] = [
        { action: { [Op.like]: `%${keyword}%` } },
        { details: { [Op.like]: `%${keyword}%` } }
      ];
    }

    const logs = await SystemLog.findAll({
      where: whereClause,
      include: [{
        model: User,
        as: 'user',
        attributes: ['name', 'student_id']
      }],
      order: [['created_at', 'DESC']],
      limit: 100 // Limit to last 100 for now
    });

    res.json(logs);
  } catch (error) {
    logger.error('获取日志失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
