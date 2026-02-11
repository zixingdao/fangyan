import { QueryTypes } from 'sequelize';
import sequelize from '../src/config/database';
import { User, Recording } from '../src/models';

const syncDB = async () => {
  try {
    console.log('正在同步数据库模型...');
    
    // force: true 会删除原有表并重建，适合初始化
    // alter: true 会尝试修改表结构以匹配模型，保留数据
    // 警告：生产环境慎用 force: true
    const isDev = process.env.NODE_ENV === 'development';
    const syncOptions = { alter: true }; // 默认使用 alter，更安全
    
    console.log(`正在同步数据库模型 (模式: ${JSON.stringify(syncOptions)})...`);
    
    await sequelize.sync(syncOptions);
    
    console.log('✅ 本地数据库初始化成功！');
    // 验证表是否创建 (SQLite 专用查询)
    const tables = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table';", { type: QueryTypes.SELECT });
    console.log('当前数据库中的表:', tables);
    
    // 检查模型是否注册
    console.log('User table name:', User.tableName);
    console.log('Sequelize match:', User.sequelize === sequelize);
    console.log('已注册的模型:', Object.keys(sequelize.models));
    // console.log('数据库文件位置:', (sequelize.options as any).storage);
  } catch (error) {
    console.error('❌ 数据库同步失败:', error);
  } finally {
    await sequelize.close();
  }
};

syncDB();
