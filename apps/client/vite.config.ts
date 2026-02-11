import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 使用相对路径，适配云开发部署
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@changsha/shared': path.resolve(__dirname, '../../packages/shared/src/index.ts'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
  build: {
    // 显式配置构建选项，确保资源文件名的稳定性
    assetsDir: 'assets',
    manifest: true, // 生成 manifest.json，方便服务端后续可能得映射
    rollupOptions: {
      output: {
        // 优化分包策略，将第三方库单独打包，减少主包体积变化频率
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react'], // 替换为实际使用的库
        },
      },
    },
  },
})
