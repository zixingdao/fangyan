export default () => {
  // 默认使用 sqlite (better-sqlite3) 以确保本地开发开箱即用
  const type = process.env.DB_TYPE || 'sqlite';
  const synchronize = process.env.DB_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production';

  if (type === 'mysql') {
    return {
      database: {
        type: 'mysql',
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '3306', 10),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'changsha_dialect',
        synchronize,
      },
    };
  }

  // SQLite (better-sqlite3) - 推荐用于开发环境
  if (type === 'sqlite') {
    return {
      database: {
        type: 'better-sqlite3', // 使用 better-sqlite3 驱动，性能更好且无需编译
        database: process.env.DB_FILE || 'database.sqlite',
        synchronize,
      },
    };
  }

  // 兼容旧配置 sqljs
  return {
    database: {
      type: 'sqljs',
      location: process.env.DB_LOCATION || 'database_v2',
      autoSave: true,
      synchronize,
    },
  };
};
