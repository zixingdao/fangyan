import { User } from '../models';

export class UserService {
  /**
   * 获取个人信息
   */
  static async getProfile(userId: number) {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password'] }
    });
    
    if (!user) {
      throw new Error('用户不存在');
    }

    return user;
  }

  /**
   * 更新个人信息
   */
  static async updateProfile(userId: number, data: any) {
    const user = await User.findByPk(userId);
    
    if (!user) {
      throw new Error('用户不存在');
    }

    // 允许更新的字段
    const { name, phone, school, hometown } = data;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (school) user.school = school;
    if (hometown) user.hometown = hometown;

    await user.save();
    return user;
  }
}
