import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const initDB = async () => {
  const config = {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    connectTimeout: 20000 // 20秒超时
  };

  console.log('Connecting to database...', { ...config, password: '***' });

  try {
    // 直接连接到指定数据库
    const dbName = process.env.DB_NAME;
    const connection = await mysql.createConnection({
      ...config,
      database: dbName
    });

    console.log(`Connected to database '${dbName}' successfully!`);
    console.log('Reading init.sql...');
    const sqlPath = path.join(__dirname, '../../database/init.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // 移除 init.sql 中的 CREATE DATABASE 和 USE 语句
    const cleanSql = sqlContent
      .replace(/CREATE DATABASE IF NOT EXISTS.*;/i, '')
      .replace(/USE.*;/i, '');

    console.log('Executing SQL script...');
    await connection.query(cleanSql);
    
    console.log('Database initialization completed successfully!');
    await connection.end();
  } catch (error: any) {
    console.error('Database initialization failed:', error.message);
    if (error.code === 'ETIMEDOUT') {
      console.error('提示: 连接超时，请检查防火墙是否允许访问端口 ' + config.port + '，或者您的 IP 是否在腾讯云数据库白名单中。');
    } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('提示: 用户名或密码错误。请确认 waimai 用户的密码是否为 xianglong1!');
    }
    process.exit(1);
  }
};

initDB();
