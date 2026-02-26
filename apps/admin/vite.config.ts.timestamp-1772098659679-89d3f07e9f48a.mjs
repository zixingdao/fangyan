// vite.config.ts
import { defineConfig } from "file:///C:/Users/xingyun/Desktop/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80%E8%BD%AF%E4%BB%B6/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.33_terser@5.46.0/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/xingyun/Desktop/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80/%E9%95%BF%E6%B2%99%E6%96%B9%E8%A8%80%E8%BD%AF%E4%BB%B6/node_modules/.pnpm/@vitejs+plugin-react@4.7.0__76c742024d7f9de00ad6487ee61e2bc1/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "C:\\Users\\xingyun\\Desktop\\\u957F\u6C99\u65B9\u8A00\\\u957F\u6C99\u65B9\u8A00\u8F6F\u4EF6\\apps\\admin";
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
    port: 5174,
    // Different port from client
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  },
  build: {
    assetsDir: "static",
    // 强制修改资源目录名为 static
    manifest: true,
    rollupOptions: {
      output: {
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx4aW5neXVuXFxcXERlc2t0b3BcXFxcXHU5NTdGXHU2Qzk5XHU2NUI5XHU4QTAwXFxcXFx1OTU3Rlx1NkM5OVx1NjVCOVx1OEEwMFx1OEY2Rlx1NEVGNlxcXFxhcHBzXFxcXGFkbWluXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFx4aW5neXVuXFxcXERlc2t0b3BcXFxcXHU5NTdGXHU2Qzk5XHU2NUI5XHU4QTAwXFxcXFx1OTU3Rlx1NkM5OVx1NjVCOVx1OEEwMFx1OEY2Rlx1NEVGNlxcXFxhcHBzXFxcXGFkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy94aW5neXVuL0Rlc2t0b3AvJUU5JTk1JUJGJUU2JUIyJTk5JUU2JTk2JUI5JUU4JUE4JTgwLyVFOSU5NSVCRiVFNiVCMiU5OSVFNiU5NiVCOSVFOCVBOCU4MCVFOCVCRCVBRiVFNCVCQiVCNi9hcHBzL2FkbWluL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBiYXNlOiAnLi8nLCAvLyBcdTRGN0ZcdTc1MjhcdTc2RjhcdTVCRjlcdThERUZcdTVGODRcdUZGMENcdTkwMDJcdTkxNERcdTRFOTFcdTVGMDBcdTUzRDFcdTkwRThcdTdGNzJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4vc3JjJyksXG4gICAgICAnQGNoYW5nc2hhL3NoYXJlZCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLi8uLi9wYWNrYWdlcy9zaGFyZWQvc3JjL2luZGV4LnRzJyksXG4gICAgfSxcbiAgfSxcbiAgc2VydmVyOiB7XG4gICAgcG9ydDogNTE3NCwgLy8gRGlmZmVyZW50IHBvcnQgZnJvbSBjbGllbnRcbiAgICBwcm94eToge1xuICAgICAgJy9hcGknOiB7XG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMCcsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBhc3NldHNEaXI6ICdzdGF0aWMnLCAvLyBcdTVGM0FcdTUyMzZcdTRGRUVcdTY1MzlcdThENDRcdTZFOTBcdTc2RUVcdTVGNTVcdTU0MERcdTRFM0Egc3RhdGljXG4gICAgbWFuaWZlc3Q6IHRydWUsXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIG1hbnVhbENodW5rczoge1xuICAgICAgICAgICdyZWFjdC12ZW5kb3InOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXG4gICAgICAgICAgJ3VpLXZlbmRvcic6IFsnbHVjaWRlLXJlYWN0J10sIC8vIFx1NjZGRlx1NjM2Mlx1NEUzQVx1NUI5RVx1OTY0NVx1NEY3Rlx1NzUyOFx1NzY4NFx1NUU5M1xuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBK1osU0FBUyxvQkFBb0I7QUFDNWIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sVUFBVTtBQUZqQixJQUFNLG1DQUFtQztBQUt6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixNQUFNO0FBQUE7QUFBQSxFQUNOLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQSxFQUNqQixTQUFTO0FBQUEsSUFDUCxPQUFPO0FBQUEsTUFDTCxLQUFLLEtBQUssUUFBUSxrQ0FBVyxPQUFPO0FBQUEsTUFDcEMsb0JBQW9CLEtBQUssUUFBUSxrQ0FBVyxvQ0FBb0M7QUFBQSxJQUNsRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLE1BQ2hCO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNMLFdBQVc7QUFBQTtBQUFBLElBQ1gsVUFBVTtBQUFBLElBQ1YsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sY0FBYztBQUFBLFVBQ1osZ0JBQWdCLENBQUMsU0FBUyxhQUFhLGtCQUFrQjtBQUFBLFVBQ3pELGFBQWEsQ0FBQyxjQUFjO0FBQUE7QUFBQSxRQUM5QjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
