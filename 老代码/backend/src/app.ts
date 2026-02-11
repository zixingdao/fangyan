import dotenv from 'dotenv';
// 加载环境变量 (必须在其他导入之前)
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import routes from './routes';
import logger from './utils/logger';
import sequelize from './config/database';

const app = express();

// 中间件配置
app.use(helmet({
  crossOriginResourcePolicy: false, // 允许跨域加载静态资源
}));
app.use(cors());

// 使用 morgan 将 HTTP 请求日志输出到 winston
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态资源服务 (上传的文件)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// 路由配置
app.use('/api', routes);

// 基础健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// 启动服务
const PORT = process.env.PORT || 3000;

// 同步数据库模型
sequelize.sync({ alter: true }).then(() => {
  logger.info('Database synced');
  const server = app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
  });
  
  server.on('error', (error) => {
    logger.error('Server error:', error);
  });
}).catch((error) => {
  logger.error('Unable to connect to the database:', error);
});

export default app;
