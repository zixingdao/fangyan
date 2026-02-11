import bcrypt from 'bcryptjs';
import { User, SystemConfig } from '../src/models';
import sequelize from '../src/config/database';

const seedDB = async () => {
  try {
    console.log('正在根据当前环境初始化种子数据...');

    // 1. 创建管理员账号
    const adminId = '2024001';
    const adminExists = await User.findOne({ where: { student_id: adminId } });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.create({
        student_id: adminId,
        phone: '13800000000',
        name: '系统管理员',
        password: hashedPassword,
        school: '系统管理中心',
        hometown: '长沙',
        status: 1, // 已通过
        role: 'admin',
        total_duration: 0
      });
      console.log('✅ 管理员账号创建成功: 学号 2024001 / 密码 123456');
    } else {
      console.log('ℹ️ 管理员账号已存在');
    }

    // 2. 创建测试用户
    const testId = '2024002';
    const userExists = await User.findOne({ where: { student_id: testId } });

    if (!userExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.create({
        student_id: testId,
        phone: '13900000000',
        name: '测试用户',
        password: hashedPassword,
        school: '测试学院',
        hometown: '长沙',
        status: 1,
        role: 'user',
        total_duration: 0
      });
      console.log('✅ 测试用户创建成功: 学号 2024002 / 密码 123456');
    } else {
      console.log('ℹ️ 测试用户已存在');
    }

    // 3. 初始化默认系统配置
    const defaultConfigs = [
      { key: 'annotation_url', value: '', description: '第三方标注平台链接' },
      { key: 'audition_qrcode', value: '', description: '试音群二维码' },
      { key: 'audition_query_url', value: '', description: '试音进度查询链接' },
      { key: 'single_limit', value: '20', description: '单人录制时长上限' },
      { key: 'multi_limit', value: '100', description: '多人录制时长上限' },
      { key: 'guide_single', value: '请使用自然的长沙话朗读以下内容...', description: '单人录制引导' },
      { key: 'guide_multi', value: '请寻找一位搭档，使用地道的长沙话进行对话...', description: '多人对话引导' }
    ];

    for (const config of defaultConfigs) {
      const existing = await SystemConfig.findOne({ where: { key: config.key } });
      if (!existing) {
        await SystemConfig.create(config);
        console.log(`✅ 初始化配置: ${config.key}`);
      } else {
        console.log(`ℹ️ 配置已存在: ${config.key}`);
      }
    }

  } catch (error) {
    console.error('❌ 种子数据初始化失败:', error);
  } finally {
    await sequelize.close();
  }
};

seedDB();
