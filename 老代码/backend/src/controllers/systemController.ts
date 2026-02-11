import { Request, Response } from 'express';
import { SystemConfig } from '../models';
import logger from '../utils/logger';

// 获取系统配置 (公开接口或需权限，视情况而定，这里前端需要获取标注链接，所以可能需要公开或普通用户权限)
export const getSystemConfig = async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const config = await SystemConfig.findOne({ where: { key } });
    if (!config) {
      // 这里的 404 会导致前端报错 "配置不存在"，对于初始化阶段这是正常的
      // 我们可以返回一个空值，或者让前端处理 404
      // 既然用户反馈弹窗报错，我们改为返回默认空值，避免报错
      return res.json({ key, value: '' });
    }
    res.json({ key: config.key, value: config.value });
  } catch (error) {
    logger.error('获取配置失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取所有配置 (管理员)
export const getAllConfigs = async (req: Request, res: Response) => {
  try {
    const configs = await SystemConfig.findAll();
    res.json(configs);
  } catch (error) {
    logger.error('获取所有配置失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新配置 (管理员)
export const updateSystemConfig = async (req: Request, res: Response) => {
  try {
    const { key, value, description } = req.body;
    let config = await SystemConfig.findOne({ where: { key } });

    if (config) {
      config.value = value;
      if (description) config.description = description;
      await config.save();
    } else {
      config = await SystemConfig.create({ key, value, description });
    }

    res.json({ message: '配置已更新', config });
  } catch (error) {
    logger.error('更新配置失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
