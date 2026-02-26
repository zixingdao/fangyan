// vite.config.ts
import { defineConfig } from "file:///C:/Users/xingyun/Desktop/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80%E8%BD%AF%E4%BB%B6/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.33_terser@5.46.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/xingyun/Desktop/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80%E8%BD%AF%E4%BB%B6/node_modules/.pnpm/@vitejs+plugin-react@4.7.0__76c742024d7f9de00ad6487ee61e2bc1/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\xingyun\\Desktop\\\u957F\u6C99\u65B9\u8A00\\\u957F\u6C99\u65B9\u8A00\u8F6F\u4EF6\\apps\\client";
var vite_config_default = defineConfig({
  base: "./",
  // 使用相对路径，适配云开发部署
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      "@changsha/shared": path.resolve(__vite_injected_original_dirname, "../../packages/shared/src/index.ts")
    }
  },
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  },
  build: {
    // 显式配置构建选项，确保资源文件名的稳定性
    assetsDir: "static",
    // 强制修改资源目录名为 static，规避 cloudbase 对 assets 的潜在限制
    manifest: true,
    // 生成 manifest.json，方便服务端后续可能得映射
    rollupOptions: {
      output: {
        // 优化分包策略，将第三方库单独打包，减少主包体积变化频率
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": ["lucide-react"]
          // 替换为实际使用的库
        }
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx4aW5neXVuXFxcXERlc2t0b3BcXFxcXHU5NTdGXHU2Qzk5XHU2NUI5XHU4QTAwXFxcXFx1OTU3Rlx1NkM5OVx1NjVCOVx1OEEwMFx1OEY2Rlx1NEVGNlxcXFxhcHBzXFxcXGNsaWVudFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxceGluZ3l1blxcXFxEZXNrdG9wXFxcXFx1OTU3Rlx1NkM5OVx1NjVCOVx1OEEwMFxcXFxcdTk1N0ZcdTZDOTlcdTY1QjlcdThBMDBcdThGNkZcdTRFRjZcXFxcYXBwc1xcXFxjbGllbnRcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3hpbmd5dW4vRGVza3RvcC8lRTklOTUlQkYlRTYlQjIlOTklRTYlOTYlQjklRTglQTglODAvJUU5JTk1JUJGJUU2JUIyJTk5JUU2JTk2JUI5JUU4JUE4JTgwJUU4JUJEJUFGJUU0JUJCJUI2L2FwcHMvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLi8nLCAvLyBcdTRGN0ZcdTc1MjhcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcdUZGMENcdTkwMDJcdTkxNERcdTRFOTFcdTVGMDBcdTUzRDFcdTkwRThcdTdGNzJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnQGNoYW5nc2hhL3NoYXJlZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL2luZGV4LnRzJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3MyxcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICAvLyBcdTY2M0VcdTVGMEZcdTkxNERcdTdGNkVcdTY3ODRcdTVFRkFcdTkwMDlcdTk4NzlcdUZGMENcdTc4NkVcdTRGRERcdThENDRcdTZFOTBcdTY1ODdcdTRFRjZcdTU0MERcdTc2ODRcdTdBMzNcdTVCOUFcdTYwMjdcbiAgICBhc3NldHNEaXI6ICdzdGF0aWMnLCAvLyBcdTVGM0FcdTUyMzZcdTRGRUVcdTY1MzlcdThENDRcdTZFOTBcdTc2RUVcdTVGNTVcdTU0MERcdTRFM0Egc3RhdGljXHVGRjBDXHU4OUM0XHU5MDdGIGNsb3VkYmFzZSBcdTVCRjkgYXNzZXRzIFx1NzY4NFx1NkY1Q1x1NTcyOFx1OTY1MFx1NTIzNlxuICAgIG1hbmlmZXN0OiB0cnVlLCAvLyBcdTc1MUZcdTYyMTAgbWFuaWZlc3QuanNvblx1RkYwQ1x1NjVCOVx1NEZCRlx1NjcwRFx1NTJBMVx1N0FFRlx1NTQwRVx1N0VFRFx1NTNFRlx1ODBGRFx1NUY5N1x1NjYyMFx1NUMwNFxuICAgIHJvbGx1cE9wdGlvbnM6IHtcbiAgICAgIG91dHB1dDoge1xuICAgICAgICAvLyBcdTRGMThcdTUzMTZcdTUyMDZcdTUzMDVcdTdCNTZcdTc1NjVcdUZGMENcdTVDMDZcdTdCMkNcdTRFMDlcdTY1QjlcdTVFOTNcdTUzNTVcdTcyRUNcdTYyNTNcdTUzMDVcdUZGMENcdTUxQ0ZcdTVDMTFcdTRFM0JcdTUzMDVcdTRGNTNcdTc5RUZcdTUzRDhcdTUzMTZcdTk4OTFcdTczODdcbiAgICAgICAgbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgICAgJ3JlYWN0LXZlbmRvcic6IFsncmVhY3QnLCAncmVhY3QtZG9tJywgJ3JlYWN0LXJvdXRlci1kb20nXSxcbiAgICAgICAgICAndWktdmVuZG9yJzogWydsdWNpZGUtcmVhY3QnXSwgLy8gXHU2NkZGXHU2MzYyXHU0RTNBXHU1QjlFXHU5NjQ1XHU0RjdGXHU3NTI4XHU3Njg0XHU1RTkzXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrYSxTQUFTLG9CQUFvQjtBQUMvYixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBRmpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE1BQU07QUFBQTtBQUFBLEVBQ04sU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUNwQyxvQkFBb0IsS0FBSyxRQUFRLGtDQUFXLG9DQUFvQztBQUFBLElBQ2xGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQTtBQUFBLElBRUwsV0FBVztBQUFBO0FBQUEsSUFDWCxVQUFVO0FBQUE7QUFBQSxJQUNWLGVBQWU7QUFBQSxNQUNiLFFBQVE7QUFBQTtBQUFBLFFBRU4sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGFBQWEsQ0FBQyxjQUFjO0FBQUE7QUFBQSxRQUM5QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
