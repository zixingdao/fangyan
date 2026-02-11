import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

// 确保环境变量已加载
dotenv.config();

let sequelize: Sequelize;

// 优先使用环境变量配置的数据库 (通常是 MySQL)
// 只有当显式指定 DB_TYPE=mysql 时才使用 MySQL，否则默认使用 SQLite 以确保本地运行顺畅
if (process.env.DB_TYPE === 'mysql' && process.env.DB_HOST && process.env.DB_USER && process.env.DB_NAME) {
  console.log('Connecting to MySQL database...');
  sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      dialect: 'mysql',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
} else {
  // 回退到 SQLite
  console.log('Using SQLite fallback...');
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../../database_v2.sqlite'),
    logging: false,
  });
}

export default sequelize;
