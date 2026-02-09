import { User, PasswordResetRequest } from '../models';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { logAction } from './systemLogService';
import { Op } from 'sequelize';

const JWT_SECRET = process.env.JWT_SECRET || 'changsha-dialect-secret';

export class AuthService {
  /**
   * 用户注册
   */
  static async register(data: any, ip: string) {
    const { student_id, phone, name, password, school, hometown } = data;

    // 检查是否已存在
    const existingUser = await User.findOne({ where: { student_id } });
    if (existingUser) {
      throw new Error('该学号已注册');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      student_id,
      phone,
      name,
      password: hashedPassword,
      school: school || '邵阳学院',
      hometown,
      status: 0, // 待审核
      role: 'user'
    });

    await logAction('info', 'user', 'register', `User registered: ${student_id}`, user.id, ip);
    return user;
  }

  /**
   * 用户登录
   */
  static async login(data: any, ip: string) {
    const { student_id, password } = data;
    const user = await User.findOne({ where: { student_id } });

    if (!user) {
      throw new Error('用户不存在');
    }

    if (user.status === 2) {
      throw new Error('账号已封禁');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('密码错误');
    }

    const token = jwt.sign(
      { id: user.id, student_id: user.student_id, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    await logAction('info', 'user', 'login', `User logged in`, user.id, ip);

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        student_id: user.student_id,
        status: user.status
      }
    };
  }

  /**
   * 提交密码重置申请
   */
  static async requestPasswordReset(data: any, ip: string) {
    const { student_id, phone, reason } = data;

    // 验证用户是否存在
    const user = await User.findOne({ where: { student_id, phone } });
    if (!user) {
      throw new Error('用户不存在或学号与手机号不匹配');
    }

    // 创建申请
    await PasswordResetRequest.create({
      student_id,
      phone,
      reason,
      status: 0
    });

    await logAction('info', 'user', 'password_reset_request', `Requested password reset`, user.id, ip);
    return true;
  }

  /**
   * 获取重置申请列表 (管理员)
   */
  static async getResetRequests(status?: string) {
    const whereClause: any = {};
    if (status !== undefined && status !== 'all') {
      whereClause.status = status;
    }

    return await PasswordResetRequest.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']]
    });
  }

  /**
   * 审核密码重置申请 (管理员)
   */
  static async auditResetRequest(requestId: number, status: number, adminRemark: string, adminId: number, ip: string) {
    const request = await PasswordResetRequest.findByPk(requestId);
    if (!request) {
      throw new Error('申请不存在');
    }

    if (request.status !== 0) {
      throw new Error('该申请已处理');
    }

    request.status = status;
    request.admin_id = adminId;
    request.admin_remark = adminRemark;
    await request.save();

    // 如果审核通过，重置用户密码为默认密码 (如 123456)
    if (status === 1) {
      const user = await User.findOne({ where: { student_id: request.student_id } });
      if (user) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        user.password = hashedPassword;
        await user.save();
        await logAction('warn', 'admin', 'reset_password', `Admin reset password for user ${user.id}`, adminId, ip);
      }
    } else {
      await logAction('info', 'admin', 'reject_reset_request', `Admin rejected reset request for ${request.student_id}`, adminId, ip);
    }

    return status === 1 ? '审核通过，密码已重置为 123456' : '已拒绝申请';
  }
}
