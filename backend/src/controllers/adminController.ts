import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import logger from '../utils/logger';

// 获取仪表盘统计数据
export const getStats = async (req: Request, res: Response) => {
  try {
    const stats = await AdminService.getDashboardStats();
    res.json(stats);
  } catch (error) {
    logger.error('获取统计数据失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取录音列表
export const getRecordings = async (req: Request, res: Response) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const status = req.query.status !== undefined ? Number(req.query.status) : undefined;
    
    const result = await AdminService.getRecordings(page, limit, status);
    res.json(result);
  } catch (error: any) {
    logger.error('获取录音列表失败:', error);
    res.status(500).json({ 
      message: `服务器内部错误: ${error.message || '未知错误'}` 
    });
  }
};

// 审核录音
export const auditRecording = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, remark } = req.body;
    const adminId = (req as any).user.id;
    
    await AdminService.auditRecording(Number(id), status, adminId, req.ip || '', remark);
    res.json({ message: '审核完成' });
  } catch (error: any) {
    logger.error('审核录音失败:', error);
    if (error.message === '录音不存在') {
      return res.status(404).json({ message: '录音不存在' });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取用户列表
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await AdminService.getAllUsers();
    res.json(users);
  } catch (error) {
    logger.error('获取用户列表失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 封禁用户
export const banUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user.id;
    
    await AdminService.banUser(Number(id), adminId, req.ip || '');

    res.json({ message: '用户已封禁' });
  } catch (error: any) {
    logger.error('封禁用户失败:', error);
    if (error.message === '用户不存在') {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 通过用户审核 (试音通过)
export const approveUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const adminId = (req as any).user.id;
    
    await AdminService.approveUser(Number(id), adminId, req.ip || '');

    res.json({ message: '用户审核通过' });
  } catch (error: any) {
    logger.error('审核用户失败:', error);
    if (error.message === '用户不存在') {
      return res.status(404).json({ message: '用户不存在' });
    }
    res.status(500).json({ message: '服务器内部错误' });
  }
};

