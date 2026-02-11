import { Response } from 'express';
import { Recording, User } from '../models';
import { AuthRequest } from '../middleware/auth';
import logger from '../utils/logger';

export const uploadRecording = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: '未上传文件' });
    }
    const { duration, record_type } = req.body;
    const userId = req.user.id;

    // 创建录制记录
    const newRecording = await Recording.create({
      user_id: userId,
      duration: parseInt(duration) || 0,
      file_url: `/uploads/${req.file.filename}`, // 相对路径，前端需拼接 base url
      record_type: parseInt(record_type) || 1,
      status: 0, // 待标注
      annotation_url: '',
      remark: ''
    });

    // 更新用户总时长 (可选，也可以通过 hook 或定时任务计算)
    const user = await User.findByPk(userId);
    if (user) {
      user.total_duration += parseInt(duration) || 0;
      await user.save();
    }

    res.status(201).json({ message: '上传成功', recording: newRecording });
  } catch (error: any) {
    logger.error('上传失败:', error);
    res.status(500).json({ 
      message: `服务器内部错误: ${error.message || '未知错误'}` 
    });
  }
};

export const getMyRecordings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const recordings = await Recording.findAll({
      where: { user_id: userId },
      order: [['upload_time', 'DESC']]
    });
    res.json(recordings);
  } catch (error: any) {
    logger.error('获取记录失败:', error);
    res.status(500).json({ message: '服务器内部错误', error: error.message });
  }
};
