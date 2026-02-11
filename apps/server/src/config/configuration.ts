export default () => {
  const type = process.env.DB_TYPE || 'sqljs';
  // 允许通过 DB_SYNCHRONIZE 环境变量强制开启同步，否则仅在非生产环境开启
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

  if (type === 'sqlite') {
    return {
      database: {
        type: 'sqlite',
        database: process.env.DB_FILE || 'database_v2.sqlite',
        synchronize,
      },
    };
  }

  return {
    database: {
      type: 'sqljs',
      location: process.env.DB_LOCATION || 'database_v2',
      autoSave: true,
      synchronize,
    },
  };
};
