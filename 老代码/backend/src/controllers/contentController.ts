import { Request, Response } from 'express';
import { Topic, SystemConfig } from '../models';
import logger from '../utils/logger';

// 获取所有话题
export const getTopics = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const whereClause: any = {};
    if (type) {
      whereClause.type = type;
    }
    const topics = await Topic.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });
    res.json(topics);
  } catch (error) {
    logger.error('获取话题失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 创建话题 (管理员)
export const createTopic = async (req: Request, res: Response) => {
  try {
    const { title, content, type } = req.body;
    const topic = await Topic.create({ title, content, type });
    res.status(201).json(topic);
  } catch (error) {
    logger.error('创建话题失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新话题 (管理员)
export const updateTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, type } = req.body;
    const topic = await Topic.findByPk(Number(id));
    if (!topic) {
      return res.status(404).json({ message: '话题不存在' });
    }
    topic.title = title;
    topic.content = content;
    topic.type = type;
    await topic.save();
    res.json(topic);
  } catch (error) {
    logger.error('更新话题失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 删除话题 (管理员)
export const deleteTopic = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByPk(Number(id));
    if (!topic) {
      return res.status(404).json({ message: '话题不存在' });
    }
    await topic.destroy();
    res.json({ message: '话题已删除' });
  } catch (error) {
    logger.error('删除话题失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 获取录制引导文案
export const getGuideContent = async (req: Request, res: Response) => {
  try {
    const singleGuide = await SystemConfig.findOne({ where: { key: 'guide_single' } });
    const multiGuide = await SystemConfig.findOne({ where: { key: 'guide_multi' } });
    
    res.json({
      single: singleGuide?.value || '暂无单人录制引导内容',
      multi: multiGuide?.value || '暂无多人对话引导内容'
    });
  } catch (error) {
    logger.error('获取引导内容失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};

// 更新录制引导文案 (管理员)
export const updateGuideContent = async (req: Request, res: Response) => {
  try {
    const { single, multi } = req.body;
    
    if (single) {
      let config = await SystemConfig.findOne({ where: { key: 'guide_single' } });
      if (config) {
        config.value = single;
        await config.save();
      } else {
        await SystemConfig.create({ key: 'guide_single', value: single, description: '单人录制引导' });
      }
    }

    if (multi) {
      let config = await SystemConfig.findOne({ where: { key: 'guide_multi' } });
      if (config) {
        config.value = multi;
        await config.save();
      } else {
        await SystemConfig.create({ key: 'guide_multi', value: multi, description: '多人对话引导' });
      }
    }

    res.json({ message: '引导内容已更新' });
  } catch (error) {
    logger.error('更新引导内容失败:', error);
    res.status(500).json({ message: '服务器内部错误' });
  }
};
