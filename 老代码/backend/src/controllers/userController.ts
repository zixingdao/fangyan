import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { AuthService } from '../services/authService';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    // 复用 AuthService 的逻辑
    await AuthService.requestPasswordReset(req.body, req.ip || '');
    res.status(201).json({ message: '申请提交成功，请等待管理员审核' });
  } catch (error: any) {
    logger.error('密码重置申请失败:', error);
    if (error.message === '用户不存在或学号与手机号不匹配') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    await UserService.updateProfile(userId, req.body);
    res.json({ message: '更新成功' });
  } catch (error: any) {
    logger.error('更新个人信息失败:', error);
    if (error.message === '用户不存在') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: '服务器错误' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const user = await UserService.getProfile(userId);
    res.json(user);
  } catch (error: any) {
    logger.error('获取个人信息失败:', error);
    if (error.message === '用户不存在') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: '服务器错误' });
  }
};
