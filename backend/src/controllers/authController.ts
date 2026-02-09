import { Request, Response } from 'express';
import { AuthService } from '../services/authService';
import logger from '../utils/logger';

// 用户注册
export const register = async (req: Request, res: Response) => {
  try {
    await AuthService.register(req.body, req.ip || '');
    res.status(201).json({ message: '注册成功，请登录' });
  } catch (error: any) {
    logger.error('注册失败:', error);
    if (error.message === '该学号已注册') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 用户登录
export const login = async (req: Request, res: Response) => {
  try {
    const result = await AuthService.login(req.body, req.ip || '');
    res.json(result);
  } catch (error: any) {
    logger.error('登录失败:', error);
    if (error.message === '用户不存在' || error.message === '密码错误') {
      return res.status(401).json({ message: error.message });
    }
    if (error.message === '账号已封禁') {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 提交重置申请
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    await AuthService.requestPasswordReset(req.body, req.ip || '');
    res.status(201).json({ message: '申请提交成功，请等待管理员审核' });
  } catch (error: any) {
    logger.error('提交重置申请失败:', error);
    if (error.message === '用户不存在或学号与手机号不匹配') {
      return res.status(404).json({ message: error.message });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取申请列表 (管理员)
export const getResetRequests = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const requests = await AuthService.getResetRequests(status as string);
    res.json(requests);
  } catch (error) {
    logger.error('获取申请列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 审核申请 (管理员)
export const auditResetRequest = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, admin_remark } = req.body;
    const adminId = (req as any).user.id;

    const message = await AuthService.auditResetRequest(Number(id), status, admin_remark, adminId, req.ip || '');
    res.json({ message });
  } catch (error: any) {
    logger.error('审核失败:', error);
    if (error.message === '申请不存在') {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === '该申请已处理') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};
