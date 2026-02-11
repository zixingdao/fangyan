import { User, Recording } from '../models';
import { logAction } from './systemLogService';

export class AdminService {
  /**
   * 获取所有录音列表
   */
  static async getRecordings(page: number = 1, limit: number = 10, status?: number) {
    const offset = (page - 1) * limit;
    const where: any = {};
    if (status !== undefined) {
      where.status = status;
    }

    const { count, rows } = await Recording.findAndCountAll({
      where,
      limit,
      offset,
      order: [['upload_time', 'DESC']],
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'name', 'student_id']
      }]
    });

    return {
      total: count,
      list: rows,
      page,
      limit
    };
  }

  /**
   * 审核录音
   */
  static async auditRecording(recordingId: number, status: number, adminId: number, ip: string, remark?: string) {
    const recording = await Recording.findByPk(recordingId);
    if (!recording) {
      throw new Error('录音不存在');
    }

    recording.status = status;
    if (remark) {
      recording.remark = remark;
    }
    await recording.save();

    await logAction('info', 'admin', 'audit_recording', `Audited recording ${recordingId} to status ${status}`, adminId, ip);
    return recording;
  }

  /**
   * 获取仪表盘统计数据
   */
  static async getDashboardStats() {
    // 1. 基础统计
    const userCount = await User.count();
    
    return {
      userCount
    };
  }

  /**
   * 获取所有用户列表
   */
  static async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * 封禁用户
   */
  static async banUser(userId: number, adminId: number, ip: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    user.status = 2; // 2 表示封禁
    await user.save();
    
    await logAction('warn', 'admin', 'ban_user', `Banned user ${userId}`, adminId, ip);
    return true;
  }

  /**
   * 通过用户审核
   */
  static async approveUser(userId: number, adminId: number, ip: string) {
    const user = await User.findByPk(userId);
    if (!user) {
      throw new Error('用户不存在');
    }
    user.status = 1; // 1 表示通过
    await user.save();
    
    await logAction('info', 'admin', 'approve_user', `Approved user ${userId}`, adminId, ip);
    return true;
  }
}
