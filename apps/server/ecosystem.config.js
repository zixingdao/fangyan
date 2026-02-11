module.exports = {
  apps: [
    {
      name: 'changsha-dialect-server',
      script: 'dist/main.js',
      instances: 'max', // Use all available cores
      exec_mode: 'cluster', // Cluster mode
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        DB_TYPE: 'mysql', // Assuming production uses MySQL
        // DB_HOST: 'localhost',
        // DB_USER: 'root',
        // ... other env vars
      },
    },
  ],
};
